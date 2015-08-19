var alg;

function invalidOperation() {
	throw new TypeError("The algorithm '" + alg + "' does not support this operation");
}

function signNone() {
	return "";
}

function verifyNone(payload, signature) {
	return signature === "";
}

function createSigner(algo, bits) {
	return function(payload, secret) {

	}
}

module.exports = function jwa(algorithm) {
	alg = algorithm;
	var operations = {};
	var macs = /(HS|RS|ES|PS|none)(256|384|512)?/.exec(algorithm);

	if(macs) {
		if(macs === "none") {
			operations.sign = signNone;
			operations.verify = verifyNone;
		} else {

		}
	}

	operations.sign = operations.sign || invalidOperation;
	operations.verify = operations.verify || invalidOperation;
	operations.encrypt = operations.encrypt || invalidOperation;
	operations.decrypt = operations.decrypt || invalidOperation;
	return operations;
};