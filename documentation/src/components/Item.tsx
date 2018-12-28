import React from 'react';
import { Box, Details, Button, Label, Tooltip } from '@primer/components';
import { LibraryContext, ZoteroOrJurisM } from './LibraryContext';
import { TestCase } from '../types';

import _inverted from '../inverted.json';
const { docTypes } = _inverted as any;

function getDocType(type: string, keys: Array<string>, hint?: string) {
  let options = docTypes[type] as any[];
  if (!options) return { filtered: [], docType: null };
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

type FieldType = "name" | "text" | "date" | "numeric";
type Field = {
  type: FieldType;
  jmField: string;
}
const pad4 = (n: Number) => ("0000" + n).slice(-4)
const pad2 = (n: Number) => ("00" + n).slice(-2)

const isodate = (y: number, m: number, d: number) => {
  let year = y && pad4(y) || '';
  let month = m && ('-' + pad2(m)) || '';
  let day = m && d && ('-' + pad2(d)) || '';
  return year + month + day;
}

const FormatName = ({ name }: { name: any }) => {
  if (name.literal) {
    return <Label outline>{name.literal}</Label>;
  } else {
    return <span><Label outline>{name.family}</Label>, <Label outline>{name.given}</Label></span>
  }
}

const FormatFieldValue = ({ type, value }: { type: FieldType, value: any}) => {
  if (type === 'text' || type === "numeric") {
    return <Label outline>{value}</Label>;
  } else if (type === "name" && Array.isArray(value)) {
    return <div>{value.map((v, i) => <FormatName key={i} name={v} />)}</div>;
  } else if (type === "date") {
    let parts = value['date-parts'];
    if (parts && parts.length > 0 && typeof parts[0] === "number") {
      return <Label outline>{isodate(parts[0], parts[1], parts[2])}</Label>;
    } else if (parts && parts.length > 0 && Array.isArray(parts[0])) {
      return <Label outline>{parts.map((p: any) => isodate(p[0], p[1], p[2])).join('/')}</Label>;
    } else {
      const end = isodate(value.year_end, value.month_end, value.day_end);
      return <Label outline>{isodate(value.year, value.month, value.day) + (end && ('/' + end) || '')}</Label>
    }
  } else {
    return <Label outline>{JSON.stringify(value)}</Label>
  }
}

type FieldMod = {
  prefix?: string;
  suffix?: string;
  'font-style'?: 'italic';
  field: string;
}

export const FieldLabel = ({ field, content }: { field: string, content: string }) => {
  return (
      <Label
        bg="gray.2"
        color="gray.9"
        >
        <Tooltip zIndex={999} text={"csl: " + field}>
            { content }
        </Tooltip>
      </Label>
  )
}

export const FieldList = ({ type, fields, hint }: {
  type: string,
  fields: Array<string | FieldMod>,
  hint?: string
}) => {
  return <div>
    { fields.map((f, i) => {
      let keys = fields.map(f => {
        if (typeof f === 'object') return f.field;
        return f;
      });
      let {  docType } = getDocType(type, keys, hint);
      let _f: FieldMod;
      if (typeof f === "string") {
        _f = { prefix: " ", suffix: " ", field: f };
      } else {
        _f = f;
      }
      let jurisField = docType.fields[_f.field];
      let content = jurisField && jurisField.jmField || _f.field;
      return (
        <span key={i}>{_f.prefix}
          <span style={{'fontStyle': _f['font-style']}} >
            <FieldLabel field={_f.field} content={content} />
          </span>
        {_f.suffix}</span>
        )
      }) }
  </div>
}

const ItemJSON = React.memo(({obj, hint}:{obj: any, hint?: string}) => {
  let keys = Object.keys(obj).filter(k => k !== 'type' && k !== 'id');
  let { filtered, docType } = getDocType(obj.type, keys, hint);
  if (!docType) {return <></>};
  return <div className="markdown-body">
    <table style={{overflow: "visible"}} /* so that the tooltips aren't clipped*/ >
      <tbody>
        <tr>
          <td><FieldLabel field="type" content="Document Type" /></td>
          <td>{docType.jmDoc}</td>
        </tr>
        { filtered.filter(k => k !== 'type').map((k) => {
          if (!docType.fields[k]) return <tr key={k}></tr>
          const field = docType.fields[k];
          return <tr key={k}>
            <td><FieldLabel field={k} content={field.jmField} /></td>
            <td><FormatFieldValue value={obj[k]} type={field.type} /></td>
          </tr>
        })}
      </tbody>
    </table>
  </div>
})

export const Item = ({citeId, show, hint}: {citeId: string, show?: boolean, hint?: string}) => {
  return (
    <Details mt={3} render={ ({open, toggle} : { open: boolean, toggle: Function }) => (
      <LibraryContext.Consumer>
        { library => (<>
          <Button is="summary" onClick={toggle}> {open ? 'Hide' : 'Show'} <ZoteroOrJurisM /> Entry { show && 'for @' + citeId }
          </Button>
          <Box mt={3} className="markdown-body">
            <ItemJSON obj={library[citeId]} hint={hint} />
          </Box>
        </>) }
      </LibraryContext.Consumer>
    )} />
  )
}

export const Items = ({test, hint} : {test: TestCase, hint: string}) => {
    let items: JSX.Element[] = [];
    if (test.type === 'single') {
        items = [test.single.id].map(id => <Item key={id} citeId={id} hint={hint} />);
    } else if (test.type === 'sequence') {
        items = [...new Set(test.sequence.reduce((acc, cs) => acc.concat(cs.map(c => c.id)), new Array<string>()))]
            .map(id => <Item key={id} show={true} citeId={id} hint={hint} />);
    }
    return <>{ items }</>
}

