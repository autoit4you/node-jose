"use strict";
var crypto = require("crypto");
var constants = require("constants");

var wrapper = {
	"dir": createDirWrapper,
	"AGCMKW": createAkwGcmWrapper,
	"RSA1_5": createRsa15Wrapper
};
var unwrapper = {
	"dir": createDirUnwrapper,
	"AGCMKW": createAkwGcmUnwrapper,
	"RSA1_5": createRsa15Unwrapper
};

function verifyBuffer(v, name) {
	if(!Buffer.isBuffer(v)) {
		throw new Error(name + " must be a buffer");
	}
}

function xor(a, b) {
	var length = a.length;
	var c = new Buffer(length);

	for(var i=0; i<length; i++) {
		c[i] = a[i] ^ b[i];
	}

	return c;
}

function createDirWrapper() {
	return function wrapKey(contentKey, mgmtKey) {
		verifyBuffer(contentKey, "contentKey");
		verifyBuffer(mgmtKey, "mgmtKey");

		if(contentKey.length !== 0) {
			throw new Error("contentKey must have a length of zero");
		}
		return {
			keydata: new Buffer(0)
		};
	}
}

function createDirUnwrapper() {
	return function unwrapKey(encKey, mgmtKey) {
		verifyBuffer(encKey, "encKey");
		verifyBuffer(mgmtKey, "mgmtKey");

		if(encKey.length !== 0) {
			throw new Error("encKey must have a length of zero");
		}
		return mgmtKey;
	}
}

function createAkwWrapper(bits) {  //Currently non-functional
	return function wrapKey(contentKey, mgmtKey) {
		verifyBuffer(contentKey, "contentKey");
		verifyBuffer(mgmtKey, "mgmtKey");

		var A = new Buffer("A6A6A6A6A6A6A6A6", "hex");
		var R = new Buffer(contentKey.length + 8);
		contentKey.copy(R, 8);

		for(var j=0; j<6; j++) {
			for(var i=8; i<R.length; i+=8) {
				var Ri = new Buffer(8);
				R.copy(Ri, 0, i, i+8);

				var aes = crypto.createCipheriv("AES-" + bits + "-ECB", mgmtKey, new Buffer(0));
				var B = aes.update(Buffer.concat([A, Ri], 16));

				var t = new Buffer(8);
				t.fill(0);
				var t2 = new Buffer([((contentKey.length/8)*j+(i/8))]);
				t2.copy(t, 8-t2.length)
				A = xor(B.slice(0, 8), new Buffer([0]));
				Ri = B.slice(8, 16);
				Ri.copy(R, i);
			}
		}

		A.copy(R, 0, 0, 8);
		return R;
	}
}

function createAkwUnwrapper(bits) {  //Currently non-functional
	return function unwrapKey(encKey, mgmtKey) {
		verifyBuffer(encKey, "encKey");
		verifyBuffer(mgmtKey, "mgmtKey");

		
	}
}

function createAkwGcmWrapper(bits) {
	return function wrapKey(encKey, mgmtKey, options) {
		verifyBuffer(encKey, "encKey");
		verifyBuffer(mgmtKey, "mgmtKey");
		verifyBuffer(options.iv, "iv");

		if(options.iv.length != 12) {
			throw new Error("iv must have 12 octets");
		}

		var cipher = crypto.createCipheriv("aes-" + bits + "-gcm", mgmtKey, options.iv);
		cipher.setAutoPadding(false);
		var ciphertext = Buffer.concat([cipher.update(encKey), cipher.final()]);
		return {
			keydata: ciphertext,
			tag: cipher.getAuthTag()
		}
	}
}

function createAkwGcmUnwrapper(bits) {
	return function unwrapKey(encKey, mgmtKey, options) {
		verifyBuffer(encKey, "encKey");
		verifyBuffer(mgmtKey, "mgmtKey");
		verifyBuffer(options.iv, "iv");
		verifyBuffer(options.tag, "tag");

		if(options.iv.length != 12) {
			throw new Error("iv must have 12 octets");
		}

		var decipher = crypto.createDecipheriv("id-aes" + bits + "-GCM", mgmtKey, options.iv);
		decipher.setAutoPadding(false);
		decipher.setAuthTag(options.tag);
		var key = Buffer.concat([decipher.update(encKey), decipher.final()]);
		return key;
	}
}

function createRsa15Wrapper() {
	return function wrapKey(encKey, mgmtKey) {
		verifyBuffer(encKey, "encKey");

		var enc = crypto.publicEncrypt({key:mgmtKey, padding:constants.RSA_PKCS1_PADDING}, encKey);
		return {
			keydata: enc
		};
	}
}

function createRsa15Unwrapper() {
	return function unwrapKey(encKey, mgmtKey) {
		verifyBuffer(encKey, "encKey");

		var plain = crypto.privateDecrypt({key:mgmtKey, padding:constants.RSA_PKCS1_PADDING}, encKey);
		return plain;
	}
}

module.exports = function(alg, bits, mode) {
	if("undefined" !== typeof mode) {
		alg = alg + mode;
	}
	return {
		wrapKey: wrapper[alg](bits),
		unwrapKey: unwrapper[alg](bits),
	};
}