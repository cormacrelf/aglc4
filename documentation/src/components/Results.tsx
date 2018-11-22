import React from 'react';
import { TestUnit, TestCase } from '../types';
import { Box, Label } from '@primer/components';
import Octicon, { Link } from '@githubprimer/octicons-react'
import { Parsed, AGLCPart, AGLCChapter, AGLCUnit, AGLCRule } from '../titles';

import slugify from 'slugify';

import { Cite } from './Cite';
import { Diff } from './Diff';
import { Item } from './Item';
import { Meta } from './Meta';

const Tags = ({test}: {test:TestCase}) => {
  if (test.type === 'stub') {
    return <Label bg="purple.4">stub</Label>
  }
  if (test.type === 'doc') {
    return <Label bg="blue.4">doc only</Label>
  }
  return test.passed
    ? <Label bg="green.3" color="gray.8">passed</Label>
    : <Label bg="red.4">failed</Label>
}

const Title = ({ rule, rest }: { rule: string, rest: string }) => {
  return <>
    <Label id={rule} size="xl" color="gray.8" bg="gray.2">{rule}</Label>
    {" "}
    <span>{rest}</span>
  </>
}

const OneTest = ({ title, test }: { title: string, test: TestCase }) => {
  const item = test.type === 'single'
    ? <Item test={test} />
    : null;
  if (test.type==='single' || test.type==='sequence' || test.meta)
    return (
      <div className="Box-body spacer">
        <h4>{title} <Tags test={test}/></h4>
        <Cite test={test} />
        <Diff test={test} />
        <Meta test={test} />
        { item }
      </div>
    )
  else return null;
}

const Group = ({ rule }: { rule: AGLCRule }) => {
  const { ruleTitle, ruleId, tests, slug } = rule;
  return <div className="Box">
    <div className="Box-header">
      <h4 className="Box-title" id={slug}>
        <a className="anchor" href={'#' + slug}>
          <Octicon><Link x={6}/></Octicon>
        </a>
        {" "}
        <Title rule={ruleId} rest={ruleTitle} />
      </h4>
    </div>
    { tests.map(e =>
      <OneTest
        key={e.parsed.rest}
        test={e.content}
        title={e.parsed.rest} />
      ) }
  </div>
}

const Unit = ({ unit } : { unit: AGLCUnit }) => {
  const { parsed, rules, slug } = unit;
  let groups = rules.map((rule, i) => {
    return <Box key={rule.ruleId} mt={i===0 ? 0 : 3}>
      <Group rule={rule} />
    </Box>
  });
  return (
    <Box p={4} className="unit">
      <Box className="unit-header">
        <h2 id={slug}>
          <Title rule={parsed.ruleId} rest={parsed.rest} />
          <a className="anchor" href={'#' + slug}>
            <Octicon><Link x={6}/></Octicon>
          </a>
        </h2>
      </Box>
      <Box p={4} className="unit-body">
        {groups}
      </Box>
    </Box>
  )
}

export const Chapter = ({chapter}: { chapter: AGLCChapter }) => {
  const { chapterNumber, chapterTitle, units } = chapter;
  let chapLink = "chapter-" + chapterNumber; // perma
  return <Box p={4} className="unit">
    <Box className="unit-header">
      <h2 id={chapLink}>
        <Title rule={""+chapterNumber} rest={chapterTitle} />
        <a className="anchor" href={'#' + chapLink}>
          <Octicon><Link x={6}/></Octicon>
        </a>
      </h2>
    </Box>
    <Box p={4} className="unit-body">
    { units.map(u => <Unit key={u.parsed.rest} unit={u} />) }
    </Box>
  </Box>
}

export const Results = ({parts}: {parts: AGLCPart[]}) => {
  let _parts = parts.map((part, i) => {
    return <Box key={part.partTitle} mt={i===0 ? 0 : 3}>
      <h1>{part.partTitle}</h1>
      { part.chapters.map((ch) => <Chapter key={ch.chapterNumber} chapter={ch} />) }
    </Box>
  })
  return (
    <div className="App-content">
      {_parts}
    </div>
  )
}
