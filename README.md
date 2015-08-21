jose.jwa(alg).sign(input, key)
jose.jwa(alg).verify(input, key, secret)
jose.jwa(alg).encrypt()
jose.jwa(alg).decrypt()

jose.jwk.symmetric(key, params)
jose.jwk.rsa(pem, params) DOESNT FOLLOW SPEC