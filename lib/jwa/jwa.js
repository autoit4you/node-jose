"use strict";
var signer = require("./signer");

module.exports = function(alg) {
	var signing = alg.match(/^(HS|RS|ES|PS|none)(256|384|512)?$/);
	var keyMgmt = alg.match(/[ab]/);
	var contEnc = alg.match(/[ab]/);
	if(signing) {
		return signer(signing[1], signing[2]);
	} else if(keyMgmt) {

	} else if(contEnc) {

	} else {
		throw new TypeError("Invalid algorithm");
	}
}