module.exports = {
  csl: "./src/aglc4-csl-m.csl",
  jurisdictionDirs: ["./src"],
  libraries: ["./test/core/*.json", "./test/*.json", "./test/csl-m/*.json"],
  suites: ["./test/core/*.yaml", "./test/csl-m/*.yaml", "./test/csl-m/*/*.yaml"],
  output: "./documentation/src/results-jurisM.json"
};

const { jestCSL } = require('jest-csl');
jestCSL(module.exports);
