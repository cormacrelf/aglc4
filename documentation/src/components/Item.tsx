import React from 'react';
import { Box, Details, Button, Label } from '@primer/components';
import { LibraryContext } from './LibraryContext';

import _inverted from '../inverted.json';
const { docTypes, allFields: _allFields } = _inverted as any;
const allFields = new Set(_allFields);

function getDocType(obj: any, hint?: string) {
  let doctype = obj.type;
  let options = docTypes[doctype] as any[];
  if (!options) return { filtered: [], docType: null };
  let keys = Object.keys(obj).filter(k => k !== 'type' && k !== 'id');
  let allFieldsOnOptions = new Set();
  options.forEach(o => Object.keys(o.fields).map(f => allFieldsOnOptions.add(f)));
  let filtered = keys.filter(k => allFieldsOnOptions.has(k));
  let candidates: any[] = [];
  options.forEach((option: any) => {
    if (filtered.every(k => option.fields[k])) {
      candidates.push(option);
    }
  });
  // console.log(obj, hint, candidates, options);
  if (candidates.length === 0) {
    return { filtered, docType: null };
  }
  if (candidates.length === 1) {
    return { filtered, docType: candidates[0] };
  }
  let cand = hint != null && candidates.find(c => c.jmDoc === hint);
  if (cand) {
    return { filtered, docType: cand };
  }
  if (cand = candidates.find(c => c.jmDoc === "Book")) {
    return { filtered, docType: cand };
  }
  if (cand = candidates.find(c => c.jmDoc === "Letter")) {
    return { filtered, docType: cand };
  }
  return { filtered, docType: null };
}

const ItemJSON = React.memo(({obj, hint}:{obj: any, hint?: string}) => {
  let keys = Object.keys(obj).filter(k => k !== 'type' && k !== 'id');
  let { filtered, docType } = getDocType(obj, hint);
  if (!docType) {return <></>};
  return <div className="markdown-body">
    <table>
      <tbody>
        <tr><td><Label>Document Type</Label></td><td>{docType.jmDoc}</td></tr>
        { filtered.filter(k => k !== 'type').map((k) => {
          if (!docType.fields[k]) return <tr key={k}></tr>
            return <tr key={k}><td><Label>{docType.fields[k].jmField}</Label></td>
              <td>{JSON.stringify(obj[k])}</td></tr>
        })}
      </tbody>
    </table>
  </div>
  // return <pre className="highlight">{
  //   JSON.stringify(obj, null, 2)
  // }</pre>;
})

export const Item = ({citeId, hint}: {citeId: string, hint?: string}) => {
  return (
    <Details mt={3} render={ ({open, toggle} : { open: boolean, toggle: Function }) => (
      <LibraryContext.Consumer>
        { library => (<>
          <Button is="summary" onClick={toggle}>
            {open ? 'Hide' : 'Show'} Zotero Entry
          </Button>
          <Box mt={3} className="markdown-body">
            <ItemJSON obj={library[citeId]} hint={hint} />
          </Box>
        </>) }
      </LibraryContext.Consumer>
    )} />
  )
}

