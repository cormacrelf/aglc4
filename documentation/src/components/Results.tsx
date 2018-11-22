import React from 'react';
import { TestUnit, TestCase } from '../types';
import { Box, Label } from '@primer/components';
import Octicon, { Link } from '@githubprimer/octicons-react'
import { Parsed, coalesceRules, coalesceChapters, coalesceParts, AGLCChapter, AGLCRuleGroup } from '../titles';

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

const Group = ({ group }: { group: AGLCRuleGroup }) => {
  const { groupRule, groupTitle, tests } = group;

  const slug = slugify(groupRule + " " + groupTitle);

  return <div className="Box">
    {/* TODO: make slug links to these with a id so people can link to examples */}
    <div className="Box-header">
      <h4 className="Box-title" id={slug}>
        <a className="anchor" href={'#' + slug}>
          <Octicon><Link x={6}/></Octicon>
        </a>
        {" "}
        <Title rule={groupRule} rest={groupTitle} />
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

const Unit = ({ parsedUnit } : { parsedUnit: Parsed<TestUnit> }) => {
  const { parsed, content: unit } = parsedUnit;
  let groups = coalesceRules(unit.tests).map((group, i) => {
    return <Box key={group.groupRule} mt={i===0 ? 0 : 3}>
      <Group group={group} />
    </Box>
  })
  const slug = slugify(parsed.rule + " " + parsed.rest);
  return (
    <Box p={4} className="unit">
      <Box className="unit-header">
        <h2 id={slug}>
          <Title rule={parsed.rule} rest={parsed.rest} />
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
    { units.map(e =>
      <Unit
        key={e.parsed.rest}
        parsedUnit={e}
      />
      ) }
    </Box>
  </Box>
}

export const Results = ({units}: {units: TestUnit[]}) => {
  let chapters = coalesceChapters(units);
  let _parts = coalesceParts(chapters);
  let parts = _parts.map((part, i) => {
    return <Box key={part.partTitle} mt={i===0 ? 0 : 3}>
      <h1>{part.partTitle}</h1>
      { part.chapters.map((ch) => <Chapter key={ch.chapterNumber} chapter={ch} />) }
    </Box>
  })
  return (
    <div className="App-content">
      {parts}
    </div>
  )
}
