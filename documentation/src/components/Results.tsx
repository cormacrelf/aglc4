import React from 'react';
import { TestUnit, TestCase, TestCaseSingle } from '../types';
import { Box, Details, Button, Label } from '@primer/components';
import Octicon, { Link } from '@githubprimer/octicons-react'
import ReactMarkdown from 'react-markdown';
import { Cite } from './Cite';

const Fragment = ({str}: {str: string}) => {
  return <span className="fragment" dangerouslySetInnerHTML={{__html: str}}></span>
}

const Output = ({ data }: {data: string | Array<string>}) => {
  if (Array.isArray(data)) {
    return <Box is="ol" pl={3}>
      { data.map((d, i) => <li key={i}><Fragment str={d} /></li>) }
    </Box>;
  } else {
    return <Fragment str={data} />
  }
};

const ExGot = ({ test }: { test: TestCase }) => {
  if (test.type === 'stub' || test.type === 'doc') {
    return <></>
  }
  if (test.passed) {
    return <Box mb={3}><Output data={test.result} /></Box>;
  }
  return <Box className="exgot" mb={3}>
    <span className="exgot--label">Expected</span>
    <Output data={test.expect} />
    <span className="exgot--label">Received</span>
    <Output data={test.result} />
  </Box>;
};

const ItemJSON = ({obj}:{obj:object}) => {
  return <pre className="highlight">{JSON.stringify(obj, null, 2)}</pre>;
}

const Item = ({test}: {test: TestCaseSingle}) => {
  return (
    <Details mt={3} render={ ({open, toggle} : { open: boolean, toggle: Function }) => (
      <>
        <Button is="summary" onClick={toggle}>
          {open ? 'Hide' : 'Show'} Zotero Entry
        </Button>
        <Box mt={3} className="markdown-body">
          <ItemJSON obj={test.item} />
        </Box>
      </>
    )} />
  )
}

const PassFail = ({test}: {test:TestCase}) => {
  if (test.type === 'stub') {
    return <Label bg="purple.4">stub</Label>
  }
  if (test.type === 'doc') {
    return <Label bg="blue.4">documentation only</Label>
  }
  return test.passed
    ? <Label bg="green.3" color="gray.8">passed</Label>
    : <Label bg="red.4">failed</Label>
}

const DocBlock = ({doc, label}: { doc?: string, label?: string }) => {
  if (!doc) return <></>;
  return <Box bg="gray.0">
    { label && <Label m={0} bg="blue.1" color="gray.9">{label}</Label> }
    <Box className="markdown-body" p={1}>
      <ReactMarkdown source={doc} />
    </Box>
  </Box>
}

const Meta = ({test}: {test: TestCase}) => {
  if (!test.meta) return <></>;
  let coalesce = !test.meta.jurisM && test.meta.zotero;
  return <>
    <DocBlock doc={test.meta.doc} />
    <DocBlock doc={test.meta.pandoc} label="Pandoc" />
    <DocBlock doc={test.meta.zotero} label={ coalesce ? "Zotero/Juris-M" : "Zotero" } />
    <DocBlock doc={test.meta.jurisM} label={ "Juris-M" } />
  </>
}

const Example = ({test}: {test: TestCase}) => {
  const item = test.type === 'single'
    ? <Item test={test} />
    : null;
  return <div className="Box">
    {/* TODO: make slug links to these with a id so people can link to examples */}
    <div className="Box-header">
      <h4 className="Box-title" id={test.slug}>
        <a className="anchor" href={'#' + test.slug}>
          <Octicon><Link x={6}/></Octicon>
        </a>
        <ParsedTitle title={test.it} />
        {" "}<PassFail test={test} />
      </h4>
    </div>
    { (test.type==='single' || test.type==='sequence' || test.meta || item) &&  
    <div className="Box-body">
      <Cite test={test} />
      <ExGot test={test} />
      <Meta test={test} />
      { item }
    </div> }
  </div>
}

const ParsedTitle = ({ title }: { title: string }) => {
  let matches = title.match(/^((?:\d+\.)*\d+)\.? (.+)/)
  if (!matches) { return <span>{ title }</span> }
  let rule = matches[1];
  let rest = matches[2];
  return <><Label size="xl" color="gray.8" bg="gray.2">{rule}</Label> <span>{rest}</span></>
}

export const Results = ({units}: {units: TestUnit[]}) => {
  return (
    <div className="App-content">
      { units.length > 0
        ? units.map(unit => (
        <Box p={4} key={unit.describe} className="unit">
          <Box className="unit-header">
            <h2 id={unit.slug}>
              <ParsedTitle title={unit.describe} />
              <a className="anchor" href={'#' + unit.slug}>
                <Octicon><Link x={6}/></Octicon>
              </a>
            </h2>
          </Box>
          <Box p={4} className="unit-body">
            { unit.tests.map((test, i) => <Box key={test.it} mt={i===0 ? 0 : 3}><Example test={test} /></Box>) }
          </Box>
        </Box>
        ))
      : null }
    </div>
  )
}

