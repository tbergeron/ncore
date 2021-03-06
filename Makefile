REPORTER = spec

test: 
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--ui tdd \
		--bail \
		--reporter $(REPORTER)

browser:
	browserify ./lib/core.js -o dist/core.js

build-test:
	./bin/ncore -o /test/browser/build.js ./test/modules/

run-test:
	/opt/google/chrome/google-chrome --enable-plugins ./test/browser.html

docs:
	./node_modules/docker/docker \
		-o auto-docs \
		-c manni \
		-I \
		-u

view-docs:
	firefox ./auto-docs/

.PHONY: test build-test browser