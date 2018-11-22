const fs = require('fs');
const path = require('path');
const { cslTestResults } = require('jest-csl');

runConfiguration(require('./test/configurations/csl-m.test'), 'results-jurisM.json')
runConfiguration(require('./test/configurations/plain-csl.test'), 'results-csl.json')

function runConfiguration(config, fname) {
  let { results, engine } = cslTestResults(config);

  results = results.map(unit => {
    return {
      ...unit,
      tests: unit.tests && unit.tests.map(attachItem)
    }
  });

  function attachItem(test) {
    if (test.single && test.single.id) {
      return {
        ...test,
        item: engine.retrieveItem(test.single.id)
      }
    }
    // todo: attach deduped items for sequence tests
    return test;
  }

  fs.writeFileSync(path.join('./documentation/src/', fname), JSON.stringify(results));
}
