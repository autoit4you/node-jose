test: test/keys

test/keys:
	@openssl genrsa 2048 > test/rsa-private.pem
	@openssl genrsa 2048 > test/rsa-private2.pem
	@openssl rsa -in test/rsa-private.pem -pubout > test/rsa-public.pem
	@openssl rsa -in test/rsa-private2.pem -pubout > test/rsa-public2.pem
	@touch test/keys

clean:
	@rm -f test/*.pem
	@rm -f test/keys