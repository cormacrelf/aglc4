module.exports = {
  csl: "./src/aglc4.csl",
  jurisdictionDirs: ["./src"],
  libraries: ["./corpus.json"],
  suites: ["./test/core/*.yaml", "./test/csl-m/*.yaml"]
};

const { jestCSL } = require('jest-csl');
jestCSL(module.exports);
