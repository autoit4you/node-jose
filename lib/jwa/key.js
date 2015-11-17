"use strict";

var wrapper = {
	"dir": createDirWrapper
};
var unwrapper = {
	"dir": createDirUnwrapper
};

function verifyBuffer(v, name) {
	if(!Buffer.isBuffer(v)) {
		throw new Error(name + " must be a buffer");
	}
}

function createDirWrapper() {
	return function wrapKey(contentKey, mgmtKey) {
		verifyBuffer(contentKey, "contentKey");
		verifyBuffer(mgmtKey, "mgmtKey");

		if(contentKey.length !== 0) {
			throw new Error("contentKey must have a length of zero");
		}
		return new Buffer(0);
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

module.exports = function(alg) {
	return {
		wrapKey: wrapper[alg](),
		unwrapKey: unwrapper[alg]()
	};
}