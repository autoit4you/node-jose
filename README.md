# jose

Build Status

JSON Object Signing and Encryption (JOSE) library (symmetric and asymmetric)

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
throws and `TypeError`.

#### Example:
```js
var jose = require('jose');
var hs256 = jose.jwa('HS256');
```