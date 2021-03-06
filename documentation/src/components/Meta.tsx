import React from 'react';
import { TestCase } from '../types';
import { Box, Label } from '@primer/components';
import { Markdown } from './Markdown';
import { IsJurisMContext } from './LibraryContext';
import { FieldList } from './Item';

const WrappedDoc = (props: any) =>
  <IsJurisMContext.Consumer
    children={(value) => <DocBlock {...props} isJurisM={value} />}
  />;

export const DocBlock = ({doc, label, isJurisM }: { doc?: string, label?: string, isJurisM?: boolean }) => {
  if (!doc) return <></>;
  if (!label || label === "main") {
    return <Box>
      <Markdown source={doc} />
    </Box>
  }
  let bgtop= "blue.1";
  let bg= "gray.0";
  if (label === 'Warning') {
    bgtop = "orange.2";
    bg = "orange.0";
  }
  if (label === 'word') {
    label = isJurisM ? "Juris-M Word Plugin" : "Zotero Word Plugin";
  }
  if (label.length >= 1) {
    label = label[0].toUpperCase() + label.slice(1);
  }
  return <Box bg={bg}>
    { label &&
      <Label m={0}
        style={{display: "block"}}
        className="doc-label"
        bg={bgtop} color="gray.9">
        {label}
      </Label> }
    <Box p={2}>
      <Markdown source={doc} />
    </Box>
  </Box>
}

export const Meta = ({test}: {test: TestCase}) => {
  const { meta, doc } = test;
  let hint = meta && meta.jmHint || undefined;
  let fields = meta && meta.fields || undefined;
  let type = meta && meta.type || undefined;
  if (!doc && !meta) return <></>;
  return <>
    { fields && <FieldList fields={fields} type={type} hint={hint} />}
    { typeof doc === 'string' && <WrappedDoc doc={doc} label="main" /> }
    { Array.isArray(doc) && doc.map((d, i) => {
      let _d: string;
      let _l: string;
      if (typeof d === 'object') {
        _l = d['label'];
        _d = d['content'];
        } else {
          _l = 'main';
          _d = d;
        }
      return <WrappedDoc key={i} doc={_d} label={_l} />
    })
  }</>;
}
