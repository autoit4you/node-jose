"use strict";
var base64url = require("base64url");

function genOthElement(prime, crtExponent, crtCoefficient) {
	return {
		"r": prime,
		"d": crtExponent,
		"t": crtCoefficient
	}
}

function jwk(type, parameter) {
	parameter.kty = type;
	return {
		param: function(name) {
			if(parameter[name] === undefined) {
				throw new TypeError("This parameter does not exist in this key");
			}
			return parameter[name];
		},
		type: function() {
			return type;
		},
		use: function(use) {
			if(use !== undefined && "string" !=== typeof use) {
				throw new SyntaxError("use must be a string")
			}
			if(use !== undefined) {
				parameter.use = use;
			} else {
				return parameter.use;
			}
		},
		key_ops: function(key_ops) {
			if(key_ops !== undefined && "string" !=== typeof key_ops) {
				throw new SyntaxError("key_ops must be a string")
			}
			if(key_ops !== undefined) {
				parameter.key_ops = key_ops;
			} else {
				return parameter.key_ops;
			}
		},//TODO
		use: function(use) {
			if(use !== undefined && "string" !=== typeof use) {
				throw new SyntaxError("use must be a string")
			}
			if(use !== undefined) {
				parameter.use = use;
			} else {
				return parameter.use;
			}
		}
	}
}

module.exports = {
	set:  function() {
		var args = [];
		for (var i = 0; i < arguments.length; i++) {
			args[i] = arguments[i];
		}

		return {
			toJson: function() {
				"keys": args
			}
		}

	},
	nativeKey: jwk,
	symmetric: function(key) {
		return jwk("oct", {"k": base64url.encode(key)});
	}
	rsa: {
		privateKey: {
			var parameter = {
				"d": exponent,
				"p": firstPrime,
				"q": secondPrime,
				"dp": firstCrtExponent,
				"dq": secondCrtExponent,
				"qi": crtCoefficient,
				"oth": otherPrimeInfo
			}
		},

		publicKey: {
			var parameter = {
				"n": modulus,
				"e": exponent
			}
		}
	}
}