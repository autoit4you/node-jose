"use strict";
var expect = require("chai").expect;
var jwa = require("../lib/jwa/jwa");
var fs = require("fs");
var alg;

describe("jwa", function() {
	describe("dir", function() {
		before(function() {
			alg = jwa("dir");
		});

		it("should be able to wrap a key", function() {
			var contentKey = new Buffer(0);
			var mgmtKey = new Buffer(16);
			var enc = alg.wrapKey(contentKey, mgmtKey);
			expect(enc).to.have.keys("keydata");
			expect(Buffer.isBuffer(enc.keydata)).to.be.true;
			expect(enc.keydata).to.have.length(0);
		});

		it("should be able to unwrap a key", function() {
			var contentKey = new Buffer(0);
			var mgmtKey = new Buffer(16);
			var enc = alg.wrapKey(contentKey, mgmtKey);
			var plain = alg.unwrapKey(enc.keydata, mgmtKey);
			expect(Buffer.isBuffer(plain)).to.be.true;
			expect(mgmtKey.equals(plain)).to.be.true;
		});

		it("should throw if the unencrypted contentKey is of non-zero length on wrapping", function() {
			var contentKey = new Buffer(1);
			var mgmtKey = new Buffer(16);
			expect(function(){alg.wrapKey(contentKey, mgmtKey);}).to.throw(/contentKey must have a length of zero/);
		});

		it("should throw if the encrypted contentKey is of non-zero length on unwrapping", function() {
			var encKey = new Buffer(1);
			var mgmtKey = new Buffer(16);
			expect(function(){alg.unwrapKey(encKey, mgmtKey);}).to.throw(/encKey must have a length of zero/);
		});
	});

	[128, 192, 256].forEach(function(bits) {
		describe.skip("A" + bits + "KW", function() { //Currently non-functional
			before(function() {
				alg = jwa("A" + bits + "KW");
			});

			it("should be able to wrap a key", function() {
				var contentKey = new Buffer(bits/8);
				contentKey.fill(255);
				var mgmtKey = new Buffer(bits/8);
				mgmtKey.fill(0);
				var enc = alg.wrapKey(contentKey, mgmtKey);
				console.log(enc);
				expect(Buffer.isBuffer(enc)).to.be.true;
				expect(enc).to.have.length(bits/8 + 8);
			});
		});
	});

	[128, 192, 256].forEach(function(bits) {
		describe("A" + bits + "GCMKW", function() {
			before(function() {
				alg = jwa("A" + bits + "GCMKW");
			});

			it("should be able to wrap a key", function() {
				var contentKey = new Buffer(bits/8);
				contentKey.fill(255);
				var mgmtKey = new Buffer(bits/8);
				mgmtKey.fill(0);
				var iv = new Buffer(12);
				iv.fill(0);
				var enc = alg.wrapKey(contentKey, mgmtKey, {iv:iv});
				expect(enc).to.have.keys("keydata", "tag");
				expect(enc.tag).to.have.length(16);
				expect(enc.keydata).to.have.length(bits/8);
			});

			it("should be able to unwrap a key it wrapped", function() {
				var contentKey = new Buffer(bits/8);
				contentKey.fill(255);
				var mgmtKey = new Buffer(bits/8);
				mgmtKey.fill(0);
				var iv = new Buffer(12);
				iv.fill(0);
				var enc = alg.wrapKey(contentKey, mgmtKey, {iv:iv});
				var plain = alg.unwrapKey(enc.keydata, mgmtKey, {iv:iv, tag:enc.tag});
				expect(contentKey.equals(plain)).to.be.true;
			});

			it("shouldn't be able to unwrap a key with the wrong managment key", function() {
				var contentKey = new Buffer(bits/8);
				contentKey.fill(255);
				var mgmtKey = new Buffer(bits/8);
				mgmtKey.fill(0);
				var mgmtKey2 = new Buffer(bits/8);
				mgmtKey2.fill(55);
				var iv = new Buffer(12);
				iv.fill(0);
				var enc = alg.wrapKey(contentKey, mgmtKey, {iv:iv});
				var plain = alg.unwrapKey.bind(null, enc.keydata, mgmtKey2, {iv:iv, tag:enc.tag});
				expect(plain).to.throw(Error);
			});
		});
	});

	describe("RSA1_5", function() {
		var privKey = [];
		var pubKey = [];
		before(function() {
			alg = jwa("RSA1_5");
			privKey[0] = fs.readFileSync("test/rsa-private.pem");
			privKey[1] = fs.readFileSync("test/rsa-private2.pem");
			pubKey[0] = fs.readFileSync("test/rsa-public.pem");
			pubKey[1] = fs.readFileSync("test/rsa-public2.pem");
		});

		it("should be able to wrap a key", function() {
			var contentKey = new Buffer(16);
			contentKey.fill(255);
			var enc = alg.wrapKey(contentKey, pubKey[0]);
			expect(Buffer.isBuffer(enc.keydata)).to.be.true;
		});

		it("should be able to unwrap a key it wrapped", function() {
			var contentKey = new Buffer(16);
			contentKey.fill(255);
			var enc = alg.wrapKey(contentKey, pubKey[0]);
			var plain = alg.unwrapKey(enc.keydata, privKey[0]);
			expect(contentKey.equals(plain)).to.be.true;
		});

		it("shouldn't be able to unwrap a key with a wrong key", function() {
			var contentKey = new Buffer(16);
			contentKey.fill(255);
			var enc = alg.wrapKey(contentKey, pubKey[0]);
			var plain = alg.unwrapKey.bind(null, enc.keydata, privKey[1]);
			expect(plain).to.throw(Error);
		});
	});
});