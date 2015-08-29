"use strict";
var expect = require("chai").expect;
var jwa = require("../lib/jwa/jwa");
var alg;

describe("jwa", function() {
	describe("none", function() {
		before(function() {
			alg = jwa("none");
		});

		it("should create an empty string as signature", function() {
			var signature = alg.sign("123456", "secret");
			expect(signature).to.not.be.null;
			expect(signature).to.equal("");
			expect(signature).to.have.length(0);
		});

		it("should verify an empty signature as valid", function() {
			expect(alg.verify("123456", "", "secret")).to.be.true;
		});

		it("shouldn't verify a non-empty signature as valid", function() {
			expect(alg.verify("123456", "1", "secret")).to.be.false;
		});
	});

	[256, 384, 512].forEach(function(bits) {
		describe("HS" + bits, function() {
			before(function() {
				alg = jwa("HS" +  + bits);
			});

			it("should create a non-empty string as signature", function() {
				var signature = alg.sign("123456", "secret");
				expect(signature).to.not.be.null;
			});

			it("should verify a signature which was created with the same input and secret", function() {
				var signature = alg.sign("123456", "secret");
				expect(alg.verify("123456", signature, "secret")).to.be.true;
			});

			it("shouldnt verify a wrong signature", function() {
				var signature = alg.sign("1234567", "secret");
				expect(alg.verify("123456", signature, "secret")).to.be.false;
			});
		});
	});
});