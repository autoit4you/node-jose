"use strict";

module.exports = {
	fromBase64: function(base64) {
		return base64.replace(/=/g, "")
				.replace(/\+/g, "-")
				.replace(/\//g, "_");
	}
}