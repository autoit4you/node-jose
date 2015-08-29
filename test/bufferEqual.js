"use strict";
var expect = require("chai").expect;
var bufferEqual = require("../lib/bufferEqual");

describe("bufferEqual", function() {
	var a = Buffer("123456");
	var b = Buffer("123456");
	var c = Buffer("1234567");
	var d = "123456";
	var e = Buffer("987654");

	it("should say that a and b are equal", function() {
		expect(bufferEqual(a, b)).to.be.true;
	});

	it("should say that a and c are not equal", function() {
		expect(bufferEqual(a, c)).to.be.false;
	});

	it("should say that a and d are not equal", function() {
		expect(bufferEqual(a, d)).to.be.false;
	});

	it("should say that a and e are not equal", function() {
		expect(bufferEqual(a, e)).to.be.false;
	});
});