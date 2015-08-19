var crypto = require('crypto');

const signerFactory = {
	"hs":createHSigner,
	"none":createNoneSigner
}

const verifierFactory = {
	"none":createNoneVerifier
}

function invalidOperation(alg) {
	return function() {
		throw new TypeError("The algorithm '" + alg + "' does not support this operation");
	}
}
function createNoneSigner() {
	return function() {
		return "";
	}
}

function createNoneVerifier() {
	return function(input, signature, secret) {
		return signature === "";
	}
}

function createHSigner(bits) {
	return function(input, secret) {
		const signer = crypto.createHmac(algo, secret);
		signer.update(payload);
		return signer.digest("base64");
	}
}

module.exports = function jwa(algorithm) {
	var operations = {};
	var macs = /(HS|RS|ES|PS|none)(256|384|512)?/.exec(algorithm);

	if(macs) {
		operations.sign = signerFactory[macs[1].toLowerCase()](macs[2]);
		operations.verify = verifierFactory[macs[1].toLowerCase()](macs[2]);
	}

	operations.sign = operations.sign || invalidOperation(algorithm);
	operations.verify = operations.verify || invalidOperation(algorithm);
	operations.encrypt = operations.encrypt || invalidOperation(algorithm);
	operations.decrypt = operations.decrypt || invalidOperation(algorithm);
	return operations;
};