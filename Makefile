
BINS = node_modules/.bin

test: node_modules
	@NODE_ENV=test $(BINS)/mocha -R spec

node_modules: package.json
	@npm install

.PHONY: test
