const x = require('./fields.json');

const { legal, strings, exclude } = x;
let docTypes = x["Juris-M"];
// docTypes = docTypes.filter(d => d[0] === 'Statute')
// console.log(strings.indexOf('jurisdiction'));
// console.log(JSON.stringify(, null, 4))

let dtmap = {};
let sets = {};

let allFields = new Set();

docTypes.map(docType => {
  const [ jmDoc, jsonDocN, ...rest ] = docType;
  const jsonDoc = strings[jsonDocN];

  const [names, dates, numeric, text] = rest;

  const fields = {}

  names.forEach(name => {
    const [jmField, json] = name;
    allFields.add(strings[json]);
    fields[strings[json]] = { type: 'name', jmField: strings[jmField] };
  })
  dates.forEach(name => {
    const [jmField, json] = name;
    allFields.add(strings[json]);
    fields[strings[json]] = { type: 'date', jmField: strings[jmField] };
  })
  numeric.forEach(name => {
    const [jmField, json] = name;
    allFields.add(strings[json]);
    fields[strings[json]] = { type: 'numeric', jmField: strings[jmField] };
  })
  text.forEach(name => {
    const [jmField, json] = name;
    allFields.add(strings[json]);
    fields[strings[json]] = { type: 'text', jmField: strings[jmField] };
  })

  // sets[jsonDoc] = sets[jsonDoc] || new Set();
  // let set = sets[jsonDoc];
  // if (!set.has(jmDoc)) {
  // set.add(jmDoc);
  if (!dtmap[jsonDoc]) {
    dtmap[jsonDoc] = [];
  }
  let same = dtmap[jsonDoc].find(d => d.jmDoc === jmDoc);
  if (same) {
    // there are dupes in this dataset with different information. Why? Who knows.
    same.fields = { ...same.fields, ...fields };
  } else {
    dtmap[jsonDoc].push({
      jmDoc,
      fields,
    });
  }
  // }
})

// console.log(dtmap['personal_communication']);

const fs = require('fs');
fs.writeFileSync('./inverted.json', JSON.stringify({ docTypes: dtmap, allFields: [...allFields] }));
