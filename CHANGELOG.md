# jose ChangeLog

## 2015-09-22, Version 0.2.0

### Notable Changes

* **jwa**:
  - Added support for all Content Encryption Algorithms specified in the JWA RFC

### Known Issues

None

### Commits

* [`945d586`] Preparing 0.2.0 release
* [`1d4f28f`] Added changelog
* [`48497ef`] Corrected error in README
* [`6e26988`] Added decrypt section to README
* [`60c6230`] Added encrypt section to README
* [`671368c`] Implemented decrypting using AES-GCM
* [`22545a6`] Implemented decrypting AES-CBC
* [`819af8a`] Drop support for 0.10
* [`2ad8eae`] Adjust build versions
* [`d0f6653`] Fix build failure on 0.10
* [`a66c086`] Fixed AES-GCM encryption
* [`f6e05c0`] Started work on Content Encryption Algorithms
* [`8300488`] Added bn.js to dependencies
* [`052d60d`] Removed unneccessary title

## 2015-09-01, Version 0.1.0

### Notable Changes

* First release


### Known Issues

None

### Commits

* [`47e2a97`] Corrected error in README
* [`b05374c`] Completed readme
* [`12d6675`] Added note about stringification of input
* [`b2e258f`] Now normalizing the input before processing it
* [`e3c05fb`] Prepared library for first release
* [`a08cdcc`] Added jwa.sign documentation
* [`53ed188`] Added Build and Coverage badges
* [`d798ac7`] Worked on the README
* [`31d2806`] Completed ES* signature verification
* [`b48772c`] Implemented signing using the ES* algorithms
* [`9859a61`] Started work on ES signatures
* [`0058847`] Implemented RSASSA-PKCS1-v1_5 signatures with tests
* [`2f2f49b`] Added toBase64 method
* [`34a2929`] Changed Travis build cmds
* [`287dce8`] Taking a new approach on this. Now supports JWA algs none and HMAC.
* [`ed6a3f6`] Setup Travis CI
* [`246c1d8`] Corrected version
* [`c5b3e73`] Added watcher tests
* [`fc3f6fe`] Finished JWK, for now
* [`ffed23d`] Abandoned the key-reader will instead use OpenSSL to do this, later...
* [`c5c75e9`] Started work on BER parser
* [`44d4d53`] Finalized Hmac Verifier
* [`9843538`] Started work on JWKs
* [`ee707ea`] Started work on Hmac verifier. Added base64url as dependency.
* [`704becb`] Now using factories
* [`25d6179`] Added Readme
* [`fa00c25`] Initial commit
