"use strict";
var base64url = require("base64url");

function mergeJson(first, second) {
	if(!second || "object" !== typeof second) return first;

	for(var obj in second) {
		first[obj] = second[obj];
	}
	return first;
}

module.exports = {
	symmetric: function(key, parameter) {
		return mergeJson({"kty":"oct", "k": base64url.encode(key)}, parameter);
	},
	rsa: function(key, parameter) {
		return mergeJson({"kty":"RSA", "node_pem_rsa": key}, parameter);
	}
}