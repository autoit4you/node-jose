"use strict";
var crypto = require("crypto");
var base64url = require("../base64url");
var bufferEqual = require("../bufferEqual");
var EcdsaSignature = require("asn1.js").define("Ecdsa-Sig-Value", function() {
	this.seq().obj(
		this.key("r").int(),
		this.key("s").int()
	);
});

var ecdsaKeySize = {
	"256": 256,
	"384": 384,
	"512": 521
}

var signer = {
	"none": createNoneSigner,
	"HS": createHsSigner,
	"RS": createRsSigner,
	"ES": createEsSigner
}

var verifier = {
	"none": createNoneVerifier,
	"HS": createHsVerifier,
	"RS": createRsVerifier,
	"ES": createEsVerifier
}

function createNoneSigner() {
	return function sign() {
		return "";
	}
}

function createNoneVerifier() {
	return function verify(input, signature) {
		return signature === "";
	}
}

function createHsSigner(bits) {
	return function sign(input, secret) {
		var hmac = crypto.createHmac("SHA" + bits, secret);
		hmac.update(input);
		return base64url.fromBase64(hmac.digest("base64"));
	}
}

function createHsVerifier(bits) {
	var signer = createHsSigner(bits);
	return function verify(input, signature, secret) {
		var sig2 = signer(input, secret);
		return bufferEqual(Buffer(signature), Buffer(sig2));
	}
}

function createRsSigner(bits) {
	return function sign(input, key) {
		var signer = crypto.createSign("RSA-SHA"+bits);
		signer.update(input);
		return base64url.fromBase64(signer.sign(key, "base64"));
	}
}

function createRsVerifier(bits) {
	return function verify(input, signature, key) {
		signature = base64url.toBase64(signature);
		var verifier = crypto.createVerify("RSA-SHA"+bits);
		verifier.update(input);
		return verifier.verify(key, signature, "base64");
	}
}

function createEsSigner(bits) {
	return function sign(input, key) {
		var signer = crypto.createSign("RSA-SHA"+bits); // openssl only signs with ec with sha2 when specifying rsa and using an ec key
		signer.update(input);
		var derSig = EcdsaSignature.decode(signer.sign(key), "der");
		var bytesLength = (ecdsaKeySize[bits]/8 | 0) + (ecdsaKeySize[bits]%8 !== 0 ? 1 : 0);
		derSig.r = new Buffer(derSig.r.toString("hex", bytesLength), "hex");
		derSig.s = new Buffer(derSig.s.toString("hex", bytesLength), "hex");
		return base64url.fromBase64(Buffer.concat([derSig.r, derSig.s], derSig.r.length + derSig.s.length).toString("base64"));
	}
}

function createEsVerifier(bits) {
	return function verify(input, signature, key) {
		signature = base64url.toBase64(signature);
		var verifier = crypto.createVerify("RSA-SHA"+bits); // See above for explanation
		verifier.update(input);
		return verifier.verify(key, signature, "base64");
	}
}

module.exports = function(alg, bits) {
	return {
		sign: signer[alg](bits),
		verify: verifier[alg](bits)
	}
}