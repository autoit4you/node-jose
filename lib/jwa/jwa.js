"use strict";
var signer = require("./signer");
var content = require("./content");
var key = require("./key");

module.exports = function jwa(alg) {
	var match;
	var signing = alg.match(/^(HS|RS|ES|none)(256|384|512)?$/);
	var keyMgmt = alg.match(/^(RSA1_5|A|dir)(128|192|256)?(GCMKW)?$/);
	var contEnc = alg.match(/^A(128|192|256)(CBC|GCM)(-HS(256|384|512))?$/);
	if(signing) {
		match = signer(signing[1], signing[2]);
	} else if(keyMgmt) {
		match = key(keyMgmt[1], keyMgmt[2], keyMgmt[3]);
	} else if(contEnc) {
		match = content(contEnc[2], contEnc[1], contEnc[4]);
	}

	if(match) {
		return match;
	} else {
		throw new TypeError("Invalid algorithm");
	}
}