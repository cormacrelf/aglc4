import React from 'react';
import { TestCase } from '../types';
import { Box, Label } from '@primer/components';
import ReactMarkdown from 'react-markdown';

const Markdown = (props: any) =>
    <Box className="markdown-body">
      <ReactMarkdown {...props} />
    </Box>

const DocBlock = ({doc, label}: { doc?: string, label?: string }) => {
  if (!doc) return <></>;
  if (!label) {
    return <Box>
      <Markdown source={doc} />
    </Box>
  }
  return <Box bg="gray.0">
    { label && <Label m={0} bg="blue.1" color="gray.9">{label}</Label> }
    <Box p={2}>
      <Markdown source={doc} />
    </Box>
  </Box>
}

export const Meta = ({test}: {test: TestCase}) => {
  if (!test.meta) return <></>;
  let coalesce = !test.meta.jurisM && test.meta.zotero;
  return <>
    <DocBlock doc={test.meta.doc} />
    <DocBlock doc={test.meta.pandoc} label="Pandoc" />
    <DocBlock doc={test.meta.zotero} label={ coalesce ? "Zotero/Juris-M" : "Zotero" } />
    <DocBlock doc={test.meta.jurisM} label={ "Juris-M" } />
  </>
}
