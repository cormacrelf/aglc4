module.exports = {
  "csl": "./src/aglc4.csl",
  "libraries": ["./corpus.json"],
  "suites": ["./test/core/*.yaml"]
}

const { jestCSL } = require('jest-csl');
jestCSL(module.exports);
