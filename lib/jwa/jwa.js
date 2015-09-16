"use strict";
var signer = require("./signer");
var content = require("./content");

module.exports = function jwa(alg) {
	var signing = alg.match(/^(HS|RS|ES|none)(256|384|512)?$/);
	var keyMgmt = alg.match(/[]/);
	var contEnc = alg.match(/^A(128|192|256)(CBC|GCM)(-HS(256|384|512))?$/);
	if(signing) {
		return signer(signing[1], signing[2]);
	} else if(keyMgmt) {

	} else if(contEnc) {
		return content(contEnc[2], contEnc[1], contEnc[4]);
	} else {
		throw new TypeError("Invalid algorithm");
	}
}