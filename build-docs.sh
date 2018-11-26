#!/bin/bash

yarn && \
yarn doc-results && \
(cd documentation && \
 yarn && \
 timeout 180s yarn build)
 # sometimes create-react-app is stalling when there's a missing file
 # netlify is incapable of cancelling builds
 # hence
 # timeout

# output in ./documentation/build
