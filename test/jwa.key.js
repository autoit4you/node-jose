"use strict";
var expect = require("chai").expect;
var jwa = require("../lib/jwa/jwa");
var alg;

describe("jwa", function() {
	describe("dir", function() {
		before(function() {
			alg = jwa("dir");
		});

		it("should not throw an error when getting the algorithm", function() {
			expect(jwa("dir")).to.not.throw;
		});

		it("should be able to wrap a key", function() {
			var contentKey = new Buffer(0);
			var mgmtKey = new Buffer(16);
			var enc = alg.wrapKey(contentKey, mgmtKey);
			expect(Buffer.isBuffer(enc)).to.be.true;
			expect(enc).to.have.length(0);
		});

		it("should be able to unwrap a key", function() {
			var contentKey = new Buffer(0);
			var mgmtKey = new Buffer(16);
			var enc = alg.wrapKey(contentKey, mgmtKey);
			var plain = alg.unwrapKey(enc, mgmtKey);
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

		it.skip("shouldn't be able to unwrap a key with the wrong key", function() {
			var contentKey = new Buffer(0);
			var mgmtKey = new Buffer(16);
			var mgmtKey2 = new Buffer(16);
			var enc = alg.wrapKey(contentKey, mgmtKey);
			expect(function() {alg.unwrapKey(enc, mgmtKey2);}).to.throw(Error);
		});
	});
});