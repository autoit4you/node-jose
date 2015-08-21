"use strict";
var expect = require("chai").expect;
var jwk = require("../index").jwk;
var base64url = require("base64url");
var fs = require("fs");

describe("jwk", function() {
	describe("#rsa", function() {
		it("should return a valid private key object", function() {
			var pem = fs.readFileSync("test/rsa_private.pem", {"encoding":"utf8", "flag":"r"});
			var rsa = jwk.rsa(pem);
			expect(rsa).to.have.all.keys("kty", "node_pem_rsa");
			expect(rsa.kty).to.equal("RSA");
		});

		it("should return a valid public key object", function() {
			var pem = fs.readFileSync("test/rsa_private.pem", {"encoding":"utf8", "flag":"r"});
				var rsa = jwk.rsa(pem);
				expect(rsa).to.have.all.keys("kty", "node_pem_rsa");
				expect(rsa.kty).to.equal("RSA");
		});

		it("should merge additional parameters", function() {
			var pem = fs.readFileSync("test/rsa_public.pem", {"encoding":"utf8", "flag":"r"});
			var rsa = jwk.rsa(pem, {"kid": "test"});
			expect(rsa).to.contain.all.keys("kid");
		});
	});
	
	describe.skip("#ec", function() {
		it("should return a valid private key object", function() {
			var pem = fs.readFileSync("test/ec_private.pem", {"encoding":"utf8", "flag":"r"});
			var rsa = jwk.ec(pem);
			expect(rsa).to.have.all.keys("kty", "node_pem_ec");
			expect(rsa.kty).to.equal("EC");
		});

		it("should return a valid public key object", function() {
			var pem = fs.readFileSync("test/ec_public.pem", {"encoding":"utf8", "flag":"r"});
			var rsa = jwk.ec(pem);
			expect(rsa).to.have.all.keys("kty", "node_pem_ec");
			expect(rsa.kty).to.equal("EC");
		});
		
		it("should merge additional parameters", function() {
			var pem = fs.readFileSync("test/ec_public.pem", {"encoding":"utf8", "flag":"r"});
			var rsa = jwk.ec(pem, {"kid": "test"});
			expect(rsa).to.contain.all.keys("kid");
		});
	});

	describe("#symmetric", function() {
		it("should return an oct jwk object", function() {
			var oct = jwk.symmetric("secret");
			expect(oct).to.have.all.keys("kty", "k");
			expect(oct.kty).to.equal("oct");
			expect(oct.k).to.equal(base64url.encode("secret"));
		});

		it("should merge additional parameters", function() {
			var oct = jwk.symmetric("secret", {"kid": "test"});
			expect(oct).to.contain.all.keys("kid");
			expect(oct.kid).to.equal("test");
		});
	});
});