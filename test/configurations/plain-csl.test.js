module.exports = {
  csl: "./src/aglc3.csl",
  libraries: ["./corpus.json"],
  suites: ["./test/core/*.yaml"],
  output: "./documentation/src/results-csl.json"
}

const { jestCSL } = require('jest-csl');
jestCSL(module.exports);
