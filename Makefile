
.PHONY: all
all: select-target

% : %.8
	8l -o $@ $<

%.8 : %.go
	8g $<

