import React from 'react';
import { TestCase } from '../types';
import { Box, Label } from '@primer/components';
import { Markdown } from './Markdown';
import { IsJurisMContext } from './LibraryContext';

export const DocBlock = ({doc, label, isJurisM }: { doc?: string, label?: string, isJurisM?: boolean }) => {
  if (!doc) return <></>;
  if (!label || label === "main") {
    return <Box>
      <Markdown source={doc} />
    </Box>
  }
  if (label === 'word') {
    label = isJurisM ? "Juris-M Word Plugin" : "Zotero Word Plugin";
  }
  if (label.length >= 1) {
    label = label[0].toUpperCase() + label.slice(1);
  }
  return <Box bg="gray.0">
    { label &&
      <Label m={0}
        style={{display: "block"}}
        className="doc-label"
        bg="blue.1" color="gray.9">
        {label}
      </Label> }
    <Box p={2}>
      <Markdown source={doc} />
    </Box>
  </Box>
}

const WrappedDoc = (props: any) =>
  <IsJurisMContext.Consumer
    children={(value) => <DocBlock {...props} isJurisM={value} />}
  />;

export const Meta = ({test}: {test: TestCase}) => {
  const { doc } = test;
  if (!doc) return <></>;
  if (typeof doc === 'string') {
    return <WrappedDoc doc={doc} label="main" />
  }
  if (Array.isArray(doc)) {
    return <>{
      doc.map((d, i) => {
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
  return <></>
}
