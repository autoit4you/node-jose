"use strict";
var signer = require("./signer");

module.exports = function jwa(alg) {
	var signing = alg.match(/^(HS|RS|ES|none)(256|384|512)?$/);
	var keyMgmt = alg.match(/[]/);
	var contEnc = alg.match(/[]/);
	if(signing) {
		return signer(signing[1], signing[2]);
	} /*else if(keyMgmt) {

	} else if(contEnc) {

	} */else {
		throw new TypeError("Invalid algorithm");
	}
}