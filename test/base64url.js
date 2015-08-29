"use strict";
var expect = require("chai").expect;
var base64url = require("../lib/base64url");

describe("base64url", function() {
	describe("#fromBase64", function() {
		it("should convert a base64 string into an base64url string", function() {
			var url = base64url.fromBase64("Zm9vYg==");
			expect(url).to.equal("Zm9vYg");
		});
	});
});