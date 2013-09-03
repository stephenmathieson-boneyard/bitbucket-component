
test:
	@./node_modules/.bin/mocha \
		--require should \
		--timeout 5000 \
		--reporter spec

test-cov: lib-cov
	@BC_COV=1 \
		./node_modules/.bin/mocha \
			--require should \
			--timeout 5000 \
			--reporter html-cov > coverage.html

lib-cov:
	@jscoverage lib lib-cov

.PHONY: test test-cov
