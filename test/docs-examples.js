"use strict";

describe.skip("Documentation Examples", function() {
	it("should be possible to use the jwa example", function() {
		var jose = require("../");
		var hs256 = jose.jwa("HS256");
	});

	it("should be possible to use the signing example", function() {
		var jose = require('../');
		var hs256 = new jose.jwa('HS256');
		var signature = hs256.sign(input, 'secret');
		expect(Buffer.isBuffer(signature)).to.be.true;
	});

	it("should be possible to use the signature verify example", function() {
		var jose = require('../');
		var hs256 = new jose.jwa('HS256');
		var signature = hs256.sign(input, 'secret');
		var isValid = hs256.verify(input, signature, 'secret');
		expect(isValid).to.be.a("boolean");
	});
});