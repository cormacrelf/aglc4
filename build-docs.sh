#!/bin/bash

yarn && \
yarn doc-results && \
(cd documentation && \
 yarn && \
 yarn build)

# output in ./documentation/build
