module.exports = {
  // csl: "./src/aglc4.csl",
  csl: "/Users/cormac/Zotero/styles/australian-guide-to-legal-citation.csl",
  libraries: ["./corpus.json"],
  suites: ["./test/core/*.yaml"],
  output: "./documentation/src/results-csl.json"
}

const { jestCSL } = require('jest-csl');
jestCSL(module.exports);
