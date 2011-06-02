EXPRESSO = node_modules/expresso/bin/expresso
TESTS= test/
.PHONY: $(TESTS)
all: start

start:
	node .
pre-install:
	npm install

bugs: test
test: $(TESTS)

$(TESTS): 
	$(EXPRESSO) --serial $(.SOURCE)
