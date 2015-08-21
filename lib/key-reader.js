"use strict";

module.exports = {
	readBer: function(buf) {
		var ber = {};
		var octetNum = 0;
		ber.class = (buf.readUInt8(0) &  0xc0) >>> 6;
		ber.structured = (buf.readUInt8(0) & 0x20) === 0x20;
		var tag = (buf.readUInt8(0) & 0x1f);
		octetNum = 1;
		if(tag === 0x1f) {
			tag = 0;
			for(; octetNum<buf.length; octetNum++) {
				var octet = buf.readUInt8(octetNum);
				tag = (tag << 7) + (octet & 0x7f);
				if((octet & 0x80) === 0x00) break;
			}
			ber.tag = tag;
			octetNum++;
		} else {
			ber.tag = tag;
		}
		var length = buf.readUInt8(octetNum);
		if((length & 0x80) === 0x00) {
			ber.length = length & 0x7f;
		} else {
			if(length === 0xff) {
				throw new TypeError("the length octet shall not be 0b11111111");
			}
			var upper = length & 0x7f;
			if(upper === 0x00) {
				
			} else {
				length = 0;
				for(var i=0; i<upper; i++) {
					length = (length << 8) + buf.readUInt8(octetNum+i+1);
				}
				octetNum += upper;
				ber.length = length;
			}
		}
		octetNum++;
		ber.content = buf.slice(octetNum, octetNum+ber.length+1);
		ber.rawLength = octetNum;
		return ber;
	}
}