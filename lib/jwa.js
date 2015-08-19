"use strict";
var crypto = require('crypto');
var base64url = require("base64url");
var bufferEqual = require('buffer-equal-constant-time');

const signerFactory = {
	"hs":createHmacSigner,
	"none":createNoneSigner
}

const verifierFactory = {
	"hs": createHmacVerifier,
	"none":createNoneVerifier
}

// general functions used by all functions
function invalidOperation(alg) {
	return function() {
		throw new TypeError("The algorithm '" + alg + "' does not support this operation");
	}
}

function isBufferOrString(obj) {
	return Buffer.isBuffer(obj) || "string" === typeof obj;
}

function normalize(obj) {
	if(!isBufferOrString(obj)) {
		obj = JSON.stringify(obj);
	}
	return obj;
}

// none algorithm
function createNoneSigner() {
	return function() {
		return "";
	}
}

function createNoneVerifier() {
	return function(input, signature) {
		return signature === "";
	}
}

// hmac algorithm
function createHmacSigner(bits) {
	return function(input, secret) {
		secret = normalize(secret);
		const signer = crypto.createHmac("SHA" + bits, secret);
		signer.update(input);
		return base64url.fromBase64(signer.digest("base64"));
	}
}

function createHmacVerifier(bits) {
	const signer = createHmacSigner(bits);
	return function(input, signature, secret) {
		const compSig = signer(input, secret);
		return bufferEqual(Buffer(compSig), Buffer(signature));
	}
}

module.exports = function jwa(algorithm) {
	var operations = {};
	var macs = /(HS|RS|ES|PS|none)(256|384|512)?/.exec(algorithm);

	if(macs) {
		operations.sign = signerFactory[macs[1].toLowerCase()](macs[2]);
		operations.verify = verifierFactory[macs[1].toLowerCase()](macs[2]);
	}

	operations.sign = operations.sign || invalidOperation(algorithm);
	operations.verify = operations.verify || invalidOperation(algorithm);
	operations.encrypt = operations.encrypt || invalidOperation(algorithm);
	operations.decrypt = operations.decrypt || invalidOperation(algorithm);
	return operations;
};