test: test/keys

test/keys:
	@openssl genrsa 2048 > test/rsa-private.pem
	@openssl genrsa 2048 > test/rsa-private2.pem
	@openssl rsa -in test/rsa-private.pem -pubout > test/rsa-public.pem
	@openssl rsa -in test/rsa-private2.pem -pubout > test/rsa-public2.pem
	@openssl ecparam -out test/ec256-private.pem -name prime256v1 -genkey
	@openssl ecparam -out test/ec256-private2.pem -name prime256v1 -genkey
	@openssl ecparam -out test/ec384-private.pem -name secp384r1 -genkey
	@openssl ecparam -out test/ec384-private2.pem -name secp384r1 -genkey
	@openssl ecparam -out test/ec512-private.pem -name secp521r1 -genkey
	@openssl ecparam -out test/ec512-private2.pem -name secp521r1 -genkey
	@openssl ec -in test/ec256-private.pem -pubout > test/ec256-public.pem
	@openssl ec -in test/ec256-private2.pem -pubout > test/ec256-public2.pem
	@openssl ec -in test/ec384-private.pem -pubout > test/ec384-public.pem
	@openssl ec -in test/ec384-private2.pem -pubout > test/ec384-public2.pem
	@openssl ec -in test/ec512-private.pem -pubout > test/ec512-public.pem
	@openssl ec -in test/ec512-private2.pem -pubout > test/ec512-public2.pem
	@touch test/keys

clean:
	@rm -f test/*.pem
	@rm -f test/keys