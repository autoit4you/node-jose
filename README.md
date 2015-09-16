# jose

[![Build](https://travis-ci.org/autoit4you/node-jose.svg?branch=master)](https://travis-ci.org/autoit4you/node-jose)
[![Coverage](https://coveralls.io/repos/autoit4you/node-jose/badge.svg?branch=master&service=github)](https://coveralls.io/github/autoit4you/node-jose?branch=master)

# API
## JWA
The implementation of the 
[JSON Web Algorithms](https://tools.ietf.org/html/rfc7518) for use
with [JSON Web Signatures](https://tools.ietf.org/html/rfc7515) or 
[JSON Web Encryption](https://tools.ietf.org/html/rfc7516).

The following cryptographic algorithms are supported for JWS:

"alg" Header Parameter | Digital Signature or MAC Algorithm
-----------------|-----------------------------------
HS256 | HMAC using SHA-256 hash algorithm
HS384 | HMAC using SHA-384 hash algorithm
HS512 | HMAC using SHA-512 hash algorithm
RS256 | RSASSA-PKCS1-v1_5 using SHA-256 hash algorithm
RS384 | RSASSA-PKCS1-v1_5 using SHA-384 hash algorithm
RS512 | RSASSA-PKCS1-v1_5 using SHA-512 hash algorithm
ES256 | ECDSA using P-256 curve and SHA-256 hash algorithm
ES384 | ECDSA using P-384 curve and SHA-384 hash algorithm
ES512 | ECDSA using P-521 curve and SHA-512 hash algorithm
none | No integrity protection

Currently no key encryption and content encryption algorithms are
supported.

### jwa(algorithm)
Creates a new `jwa` object with `sign` and `verify` methods, depending 
on the specified algorithm. Valid values for `algorithm` can be found 
in the above table and are case-sensitive. Passing an invalid algorithm 
will throw a `TypeError`.

#### Example:
```js
var jose = require('jose');
var hs256 = jose.jwa('HS256');
```

### jwa.sign(input, secretOrPrivateKey)
*This method is only available to algorithms for digital signatures and MACs.*

Sign `input` with either a secret using a HMAC algorithm or
a *private* key using a digital signature algorithm.

If `input` is neither a string nor a buffer, 
it will be stringified using `JSON.stringify`.

When using a HMAC algorithm `secretOrPrivateKey` should be either a
string or a buffer. When using a digital signature algorithm, the
value should be a PEM encoded *private* key.

Returns the signature in [base64url](https://en.wikipedia.org/wiki/Base64#URL_applications) format.

#### Example:
```js
var jose = require('jose');
var hs256 = jose.jwa('HS256');
var signature = hs256.sign('input', 'secret');
console.log(signature); // Prints 'jYmF0Et6vTLLqjd5o9qgGeDSaaIq7BWvjnKW9wLMaMY'
```

### jwa.verify(input, signature, secretOrPublicKey)
*This method is only available to algorithms for digital signatures and MACs.*

Verify that `signature` is a valid signature for `input` using 
a secret for HMAC algorithms or a *public* key for 
digital signature algorithms.

If `input` is neither a string nor a buffer,
it will be stringified using `JSON.stringify`.

When using a HMAC algorithm `secretOrPublicKey` should be either a
string or a buffer. Whenn using a digital signature algorithm, the
value should be a PEM encoded *public* key.

Returns a boolean indicating whether or not the signature is valid.

#### Example:
```js
var jose = require('jose');
var hs256 = jose.jwa('HS256');
var isValid = hs256.verify('input', 'jYmF0Et6vTLLqjd5o9qgGeDSaaIq7BWvjnKW9wLMaMY', 'secret');
console.log(isValid); // Prints 'true'
```