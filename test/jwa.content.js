"use strict";
var expect = require("chai").expect;
var jwa = require("../lib/jwa/jwa");
var alg;

describe("jwa", function() {
	[128, 192, 256].forEach(function(bits) {
		describe("A" + bits + "GCM", function() {
			before(function() {
				alg = jwa("A" + bits + "GCM");
			});

			it("should create an object with the ciphertext and tag", function() {
				var enc = alg.encrypt("top secret", "aad", new Buffer(96), new Buffer(bits));
				expect(enc).to.have.all.keys("cipher", "tag");
			});
		});

		describe("A" + bits + "CBC-HS" + (bits*2), function() {
			before(function() {
				alg = jwa("A" + bits + "CBC-HS" + (bits*2));
			});

			it("should create an object with the ciphertext and tag", function() {
				var enc = alg.encrypt("top secret", new Buffer("aad"), new Buffer(128/8), new Buffer(bits/4));
				expect(enc).to.have.all.keys("cipher", "tag");
			});
		});
	});
});
//For testing with jose4j
/*it("tests", function() {
	alg = jwa("A128CBC-HS256");
	var plain = new Buffer(128);
	plain.fill(0);
	var aad = new Buffer(3);
	aad.fill(0);
	var iv = new Buffer(16);

	iv.fill(0);
	var key = new Buffer(32);
	key.fill(0);
	var enc = alg.encrypt(plain, aad, iv, key);
	
	var cipher = new Int8Array(enc.cipher);
	var tag = new Int8Array(enc.tag);
	var s = "{";
	for(var i=0; i<cipher.length; i++) {
		s+= cipher[i] + ",";
	}
	s+= "}";
	console.log(s);

	s = "{";
	for(var i=0; i<tag.length; i++) {
		s+= tag[i] + ",";
	}
	s+= "}";
	console.log(s);
});*/