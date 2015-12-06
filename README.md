# jose

[![Build](https://travis-ci.org/autoit4you/node-jose.svg?branch=master)](https://travis-ci.org/autoit4you/node-jose)
[![Coverage](https://coveralls.io/repos/autoit4you/node-jose/badge.svg?branch=master&service=github)](https://coveralls.io/github/autoit4you/node-jose?branch=master)

# API
## JWA
The implementation of the 
[JSON Web Algorithms](https://tools.ietf.org/html/rfc7518) for use
with [JSON Web Signatures](https://tools.ietf.org/html/rfc7515) or 
[JSON Web Encryption](https://tools.ietf.org/html/rfc7516).

The following digital signature/MAC algorithms are supported:

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

The following key encryption algorithms are supported:

"alg" Header Parameter | Key Encryption Algorithm | Additional paramters needed
-----------------------|------------------------- | ---------------------------
RSA1_5 | Key wrapping using RSAES-PKCS1-v1_5 | none
dir | Direct use of key as CEK | none
A128GCMKW | Key wrapping using AES-GCM with 128-bit key | iv, tag for unwrapping
A192GCMKW | Key wrapping using AES-GCM with 192-bit key | iv, tag for unwrapping
A256GCMKW | Key wrapping using AES-GCM with 256-bit key | iv, tag for unwrapping

The following content encryption algorithms are supported:

"enc" Header Parameter | Content Encryption Algorithm
-----------------|-----------------------------------------
A128CBC-HS256 | AES CBC using 128-bit key with SHA-256 as HMAC
A192CBC-HS384 | AES CBC using 192-bit key with SHA-384 as HMAC
A256CBC-HS512 | AES CBC using 256-bit key with SHA-512 as HMAC
A128GCM | AES GCM using 128-bit key
A192GCM | AES GCM using 192-bit key
A256GCM | AES GCM using 256-bit key

### jwa(algorithm)
Creates a new `jwa` object with `sign` and `verify` or `encrypt` and `decrypt` methods, depending 
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

`input` must be a buffer.

When using a HMAC algorithm `secretOrPrivateKey` should be either a
string or a buffer. When using a digital signature algorithm, the
value should be a PEM encoded *private* key.

Returns the signature as buffer.

#### Example:
```js
var jose = require('jose');
var hs256 = new jose.jwa('HS256');
var signature = hs256.sign(input, 'secret');
console.log(signature); // Prints Buffer <8C, ...
```

### jwa.verify(input, signature, secretOrPublicKey)
*This method is only available to algorithms for digital signatures and MACs.*

Verify that `signature` is a valid signature for `input` using 
a secret for HMAC algorithms or a *public* key for 
digital signature algorithms.

`input` must be a buffer.

When using a HMAC algorithm `secretOrPublicKey` should be either a
string or a buffer. When using a digital signature algorithm, the
value should be a PEM encoded *public* key.

Returns a boolean indicating whether or not the signature is valid.

#### Example:
```js
var jose = require('jose');
var hs256 = new jose.jwa('HS256');
var isValid = hs256.verify(input, signature, 'secret');
console.log(isValid); // Prints 'true'
```

### jwa.encrypt(plaintext, aad, iv, key)
*This method is only available to algorithms for content encryption.*

Encrypt `plaintext` and compute an authentication tag using `aad`,
`iv` and `key`.

All parameters must be `Buffer`s except `plaintext` which can
also be a `string`.

Returns an object containing `cipher` with the ciphertext and `tag`
with the authentication tag, both being a `Buffer`.

#### Example:
```js
var jose = require('jose');
var aes = new jose.jwa('A256GCM');
var enc = aes.encrypt('secret', aad, iv, key);
console.log(enc.cipher); // Prints Buffer <5F, ...
console.log(enc.tag); // Prints Buffer <9E, ...
```

### jwa.decrypt(ciphertext, tag, aad, iv, key)
*This method is only available to algorithms for content encryption.*

Authenticate and decrypt `ciphertext` using `tag`, `aad`, `iv` and `key`.

All parameters must be `Buffer`s.

Returns a `Buffer` containing the decrypted plaintext. Throws an
Error if the `ciphertext` can't be authenticated.

#### Example:
```js
var jose = require('jose');
var aes = new jose.jwa('A256GCM');
var plain = aes.encrypt(ciphertext, tag, aad, iv, key);
console.log(plain); // Prints Buffer <F9, ...
```

### jwa.wrapKey(keyToWrap, key[, options])
*This method is only available to algorithms for key encryption.*

Wraps the `keyToWrap` with a key suitable to the used algorithm,
as defined by RFC7518. `options` may have to be provided, 
depending on the algorithm used for wrapping.

`keyToWrap` must be a `Buffer`.
`key` must be of an type that the used algorithm accepts.
`options`, if provided, must be an object.

Returns an object containing `keydata`, which is a `Buffer`, 
and possibly further arguments that are needed to unwrap the key again 
(see supported algorithms table).

#### Example:
```js
var jose = require('jose');
var rsa = new jose.jwa('RSA1_5');
var wrapped = rsa.wrapKey(keyToWrap, key);
console.log(wrapped.keydata); // Prints Buffer <58, ...
```

### jwa.unwrapKey(keyToUnwrap, key[, options])
*This method is only available to algorithms for key encryption.*

Unwraps the `keyToUnwrap` with a key suitable to the used algorithm,
as defined by RFC7518. `options` may have to be provided, 
depending on the algorithm used for unwrapping.

`keyToUnwrap` must be a `Buffer`.
`key` must be of an type that the used algorithm accepts.
`options`, if provided, must be an object.

Returns a `Buffer`, which is the unwrapped key.

#### Example:
```js
var jose = require('jose');
var rsa = new jose.jwa('RSA1_5');
var unwrapped = rsa.unwrapKey(keytoUnwrap, key);
console.log(unwrapped); // Prints Buffer <A7, ...
```
