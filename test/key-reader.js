"use strict";
var expect = require("chai").expect;
var reader = require("../lib/key-reader");

describe("keyReader", function() {
	describe.skip("#readBer", function() {
		it("should return a proper BER object", function() {
			var buf = new Buffer(7);
			buf[0] = 0x04;
			buf[1] = 0x05;
			buf[2] = 0x12;
			buf[3] = 0x34;
			buf[4] = 0x56;
			buf[5] = 0x78;
			buf[6] = 0x90;
			var ber = reader.readBer(buf);
			expect(ber).to.have.all.keys("class", "structured", "tag", "length", "content", "rawLength");
		});

		it("should properly parse the BER object with length in short form", function() {
			var buf = new Buffer(7);
			buf[0] = 0x04;
			buf[1] = 0x05;
			buf[2] = 0x12;
			buf[3] = 0x34;
			buf[4] = 0x56;
			buf[5] = 0x78;
			buf[6] = 0x90;
			var ber = reader.readBer(buf);
			expect(ber.class).to.equal(0);
			expect(ber.structured).to.be.false;
			expect(ber.tag).to.equal(4);
			expect(ber.length).to.equal(5);
			expect(ber.content.length).to.equal(5);
			expect(ber.rawLength).to.equal(7);
		});

		it("should properly parse the BER object with length in long form", function() {
			var buf = new Buffer(532);
			buf[0] = 0x30;
			buf[1] = 0x82;
			buf[2] = 0x02;
			buf[3] = 0x10;
			buf[4] = 0x04;
			var ber = reader.readBer(buf);
			expect(ber.class).to.equal(0);
			expect(ber.structured).to.be.true;
			expect(ber.tag).to.equal(16);
			expect(ber.length).to.equal(528);
			expect(ber.content.length).to.equal(528);
			expect(ber.rawLength).to.equal(532);
		});

		it("should properly parse the BER object with long tag", function() {
			var buf = new Buffer(9);
			buf[0] = 0xdf;
			buf[1] = 0x82;
			buf[2] = 0x02;
			buf[3] = 0x05;
			buf[4] = 0x12;
			buf[5] = 0x34;
			buf[6] = 0x56;
			buf[7] = 0x78;
			buf[8] = 0x90;
			var ber = reader.readBer(buf);
			expect(ber.class).to.equal(3);
			expect(ber.structured).to.be.false;
			expect(ber.tag).to.equal(258);
			expect(ber.length).to.equal(5);
			expect(ber.content.length).to.equal(5);
			expect(ber.rawLength).to.equal(9);
		});

		it("should properly parse the BER object with unkown length", function() {
			var buf = new Buffer(9);
			buf[0] = 0x30;
			buf[1] = 0x80;
			buf[2] = 0x04;
			buf[3] = 0x03;
			buf[4] = 0x56;
			buf[5] = 0x78;
			buf[6] = 0x90;
			buf[7] = 0x00;
			buf[8] = 0x00;
			var ber = reader.readBer(buf);
			expect(ber.class).to.equal(0);
			expect(ber.structured).to.be.true;
			expect(ber.tag).to.equal(16);
			expect(ber.length).to.equal(5);
			expect(ber.content.length).to.equal(5);
			expect(ber.rawLength).to.equal(9);
		});

		it("should throw an error with a length of 0b11111111", function() {
			var buf = new Buffer(532);
			buf[0] = 0x30;
			buf[1] = 0xff;
			buf[2] = 0x02;
			buf[3] = 0x10;
			buf[4] = 0x04;
			function fn() { var ber = reader.readBer(buf); };
			expect(fn).to.throw(TypeError);
		});
	});

	describe("#parseTag", function() {

	});
});