import React from 'react';
import { TestCase } from '../types';
import { Box, Label, Heading } from '@primer/components';
import Octicon, { Link } from '@githubprimer/octicons-react'
import { AGLCPart, AGLCChapter, AGLCUnit, AGLCRule } from '../titles';

import { Cite } from './Cite';
import { Diff } from './Diff';
import { Item } from './Item';
import { Meta } from './Meta';
import { Tags } from './Tags';

const Title = ({ rule, rest }: { rule: string, rest: string }) => {
  return <>
    <Label id={rule} size="xl" color="gray.8" bg="gray.2">{rule}</Label>
    {" "}
    <span>{rest}</span>
  </>
}

const testFailed = (test: TestCase) => {
  return !test.passed && (test.type !== 'doc' && test.type !== 'stub')
}

const testBg = (test: TestCase) => {
  if (testFailed(test)) return 'red.0';
  if (test.type === 'doc') return 'blue.0';
}

export const OneTest = ({ title, test }: { title: string, test: TestCase }) => {
  const item = test.type === 'single'
    ? <Item test={test} />
    : null;
  if (test.type === 'stub') {
    return <div className="Box-body spacer">
        <h4>{title} <Tags test={test}/></h4>
    </div>
  }
  if (test.type==='single' || test.type==='sequence' || test.meta)
    return (
      <Box bg={testBg(test)} className={"Box-body spacer" + (testFailed(test) ? ' failed' : '')}>
        <h4>{title} <Tags test={test}/></h4>
        <Cite test={test} />
        <Diff test={test} />
        <Meta test={test} />
        { item }
      </Box>
    )
  else return null;
}

export const Rule = ({ rule }: { rule: AGLCRule }) => {
  const { ruleTitle, ruleId, tests, slug } = rule;
  return <div id={slug + "-block"} className="Box rule-group">
    <a id={slug} className="offset-anchor"></a>
    <div className="Box-header rule-group-header">
      <Heading is="h4" fontSize={2} className="Box-title">
        <a className="anchor" href={'#' + slug}>
          <Octicon><Link x={6}/></Octicon>
        </a>
        {" "}
        <Title rule={ruleId} rest={ruleTitle} />
      </Heading>
    </div>
    { tests.map(e =>
      <OneTest
        key={e.parsed.rest}
        test={e.content}
        title={e.parsed.rest} />
      ) }
  </div>
}

export const Unit = ({ unit } : { unit: AGLCUnit }) => {
  const { parsed, rules, slug } = unit;
  let groups = rules.map((rule, i) => {
    return <Box key={rule.ruleId} mt={i===0 ? 0 : 3}>
      <Rule rule={rule} />
    </Box>
  });
  return (
    <Box className="unit" id={slug + "-block"}>
      <a id={slug} className="offset-anchor"></a>
      <Box pb={1} pt={1} {...stretch(4, 0)} bg="gray.0" className="unit-header">
        <h3>
          <Title rule={parsed.ruleId} rest={parsed.rest} />
          <a className="anchor" href={'#' + slug}>
            <Octicon><Link x={6}/></Octicon>
          </a>
        </h3>
      </Box>
      <Box p={4} className="unit-body">
        {groups}
      </Box>
    </Box>
  )
}

const stretch = (edge: number, pi: number) => ({
  pl: edge + pi,
  ml: -edge,
  mr: -edge,
  pr: edge + pi,
});

export const Chapter = ({chapter}: { chapter: AGLCChapter }) => {
  const { slug, chapterNumber, chapterTitle, units } = chapter;
  return <Box className="chapter" id={slug + "-block"}>
    <a id={slug} className="offset-anchor"></a>
    <Box pt={1} pb={1} {...stretch(4, 0)} bg="gray.0" className="chapter-header">
      <h2>
        <Title rule={""+chapterNumber} rest={chapterTitle} />
        <a className="anchor" href={'#' + slug}>
          <Octicon><Link x={6}/></Octicon>
        </a>
      </h2>
    </Box>
    <Box className="chapter-body">
    { units.map(u => <Unit key={u.parsed.rest} unit={u} />) }
    </Box>
  </Box>
}

export const Results = ({parts}: {parts: AGLCPart[]}) => {
  let _parts = parts.map((part, i) => {
    return <Box p={4} key={part.partTitle} id={part.slug + "-block"} className="part">
      <a id={part.slug} className="offset-anchor"></a>
      <Box pb={0} {...stretch(4, 0)} className="part-header">
        <h1>{part.partTitle}</h1>
      </Box>
      { part.chapters.map((ch) => <Chapter key={ch.chapterNumber} chapter={ch} />) }
    </Box>
  })
  return ( <div className="App-content">
      {_parts}
    </div>
  )
}
