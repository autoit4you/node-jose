"use strict";

module.exports = function(a, b) {
	if(!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
		return false;
	}

	if(a.length !== b.length) {
		return false;
	}

	var diff = 0;
	for(var i=0; i<a.length; i++) {
		diff |= a[i] ^ b[i];
	}
	return diff === 0;
}