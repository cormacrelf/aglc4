module.exports = {
  // csl: "./src/aglc4.csl",
  csl: "/Users/cormac/Zotero/styles/australian-guide-to-legal-citation.csl",
  jurisdictionDirs: ["./src"],
  libraries: ["./corpus.json"],
  suites: ["./test/core/*.yaml", "./test/csl-m/*.yaml"]
};

const { jestCSL } = require('jest-csl');
jestCSL(module.exports);
