#! /usr/bin/make -f
SHELL:=/bin/bash

##
##  make [-n] <command>
##  where command is one of:
##

ignore:=README.org
org.jsonld:=$(wildcard *.owl.org)

jsonld:=$(patsubst %.owl.org,%.owl.jsonld,${org.jsonld})

.PHONY: help

help:
	@grep -E '^##.*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = "##"}; {printf "%s\n", $$2}';\
	grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}';\
	echo -e "\n___ variables ___";\
	echo jsonld:=${jsonld}

.PHONY: tangle

.PHONY:tangle
tangle:${jsonld} ## tangle org mode files

${jsonld}:%.owl.jsonld:%.owl.org ## foo
	emacs -Q --batch --eval "(progn (require 'ob-tangle)\
	    (dolist (file command-line-args-left)\
	      (with-current-buffer (find-file-noselect file)\
	        (org-babel-tangle))))" "$<"
