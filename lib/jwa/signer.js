"use strict";
var crypto = require("crypto");
var base64url = require("../base64url");
var bufferEqual = require("../bufferEqual");

var signer = {
	"none": createNoneSigner,
	"HS": createHsSigner,
	"RS": createRsSigner
}

var verifier = {
	"none": createNoneVerifier,
	"HS": createHsVerifier,
	"RS": createRsVerifier
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

module.exports = function(alg, bits) {
	return {
		sign: signer[alg](bits),
		verify: verifier[alg](bits)
	}
}