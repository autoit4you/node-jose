"use strict";
var crypto = require("crypto");
var base64url = require("../base64url");
var bufferEqual = require("../bufferEqual");

var signer = {
	"none": createNoneSigner,
	"HS": createHsSigner
}

var verifier = {
	"none": createNoneVerifier,
	"HS": createHsVerifier
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

module.exports = function(alg, bits) {
	return {
		sign: signer[alg](bits),
		verify: verifier[alg](bits)
	}
}