"use strict";

function padString(str) {
	var diff = str.length % 4;
	if(!diff) {
		return str;
	}
	var pos = str.length;
	var padLength = 4 - diff;
	var buf = Buffer(str.length + padLength);
	buf.write(str);
	while(padLength--) {
		buf.write("=", pos++);
	}
	return buf.toString();
}

module.exports = {
	fromBase64: function(base64) {
		return base64.replace(/=/g, "")
				.replace(/\+/g, "-")
				.replace(/\//g, "_");
	},
	toBase64: function(base64url) {
		return padString(base64url);
	}
}