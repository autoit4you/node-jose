"use strict";
var expect = require("chai").expect;
var jwa = require("../lib/jwa/jwa");
var fs = require("fs");
var alg;

describe("jwa", function() {
	describe("none", function() {
		before(function() {
			alg = jwa("none");
		});

		it("should create an empty buffer as signature", function() {
			var input = new Buffer(6);
			input.fill(0);
			var signature = alg.sign(input, "secret");
			expect(signature).to.not.be.null;
			expect(Buffer.isBuffer(signature)).to.be.true;
			expect(signature).to.have.length(0);
		});

		it("should verify an zero-length buffer signature as valid", function() {
			var input = new Buffer(6);
			input.fill(0);
			expect(alg.verify(input, new Buffer(0), "secret")).to.be.true;
		});

		it("shouldn't verify a non-zero-length buffer signature as valid", function() {
			var input = new Buffer(6);
			input.fill(0);
			expect(alg.verify(input, new Buffer(1), "secret")).to.be.false;
		});
	});

	[256, 384, 512].forEach(function(bits) {
		describe("HS" + bits, function() {
			before(function() {
				alg = jwa("HS" + bits);
			});

			it("should create a non-empty buffer as signature", function() {
				var input = new Buffer(6);
				input.fill(0);
				var signature = alg.sign(input, "secret");
				expect(signature).to.not.be.null;
				expect(Buffer.isBuffer(signature)).to.be.true;
			});

			it("should verify a signature which was created with the same input and secret", function() {
				var input = new Buffer(6);
				input.fill(0);
				var signature = alg.sign(input, "secret");
				expect(alg.verify(input, signature, "secret")).to.be.true;
			});

			it("shouldnt verify a wrong signature", function() {
				var input1 = new Buffer(6);
				input1.fill(0);
				var input2 = new Buffer(6);
				input2.fill(1);
				var signature = alg.sign(input1, "secret");
				expect(alg.verify(input2, signature, "secret")).to.be.false;
			});

			it("shouldnt verify with a wrong secret", function() {
				var input = new Buffer(6);
				input.fill(0);
				var signature = alg.sign(input, "secret");
				expect(alg.verify(input, signature, "secret2")).to.be.false;
			});
		});
	});

	[256, 384, 512].forEach(function(bits) {
		describe("RS" + bits, function() {
			var privKey = [];
			var pubKey = [];
			before(function() {
				alg = jwa("RS" + bits);
				privKey[0] = fs.readFileSync("test/rsa-private.pem");
				privKey[1] = fs.readFileSync("test/rsa-private2.pem");
				pubKey[0] = fs.readFileSync("test/rsa-public.pem");
				pubKey[1] = fs.readFileSync("test/rsa-public2.pem");
			});

			it("should create a non-empty buffer as signature", function() {
				var input = new Buffer(6);
				input.fill(0);
				var signature = alg.sign(input, privKey[0]);
				expect(signature).to.not.be.null;
				expect(Buffer.isBuffer(signature)).to.be.true;
			});

			it("should verify a signature which was created with the same input and secret", function() {
				var input = new Buffer(6);
				input.fill(0);
				var signature = alg.sign(input, privKey[0]);
				expect(alg.verify(input, signature, pubKey[0])).to.be.true;
			});

			it("shouldnt verify a wrong signature", function() {
				var input1 = new Buffer(6);
				input1.fill(0);
				var input2 = new Buffer(6);
				input2.fill(1);
				var signature = alg.sign(input1, privKey[0]);
				expect(alg.verify(input2, signature, pubKey[0])).to.be.false;
			});

			it("shouldnt verify with a wrong secret", function() {
				var input = new Buffer(6);
				input.fill(0);
				var signature = alg.sign(input, privKey[0]);
				expect(alg.verify(input, signature, pubKey[1])).to.be.false;
			});
		});
	});

	[256, 384, 512].forEach(function(bits) {
		describe("ES" + bits, function() {
			var privKey = [];
			var pubKey = [];
			before(function() {
				alg = jwa("ES" + bits);
				privKey[0] = fs.readFileSync("test/ec" + bits + "-private.pem");
				privKey[1] = fs.readFileSync("test/ec" + bits + "-private2.pem");
				pubKey[0] = fs.readFileSync("test/ec" + bits + "-public.pem");
				pubKey[1] = fs.readFileSync("test/ec" + bits + "-public2.pem");
			});

			it("should create a non-empty buffer as signature", function() {
				var input = new Buffer(6);
				input.fill(0);
				var signature = alg.sign(input, privKey[0]);
				expect(signature).to.not.be.null;
				expect(Buffer.isBuffer(signature)).to.be.true;
			});

			it("should verify a signature which was created with the same input and secret", function() {
				var input = new Buffer(6);
				input.fill(0);
				var signature = alg.sign(input, privKey[0]);
				expect(alg.verify(input, signature, pubKey[0])).to.be.true;
			});

			it("shouldnt verify a wrong signature", function() {
				var input1 = new Buffer(6);
				input1.fill(0);
				var input2 = new Buffer(6);
				input2.fill(1);
				var signature = alg.sign(input1, privKey[0]);
				expect(alg.verify(input2, signature, pubKey[0])).to.be.false;
			});

			it("shouldnt verify with a wrong secret", function() {
				var input = new Buffer(6);
				input.fill(0);
				var signature = alg.sign(input, privKey[0]);
				expect(alg.verify(input, signature, pubKey[1])).to.be.false;
			});
		});
	});
});