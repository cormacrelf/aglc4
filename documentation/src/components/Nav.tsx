import React from 'react';
import { TestUnit } from '../types';
import { mapReduce, getFilter } from '../filters';
import { Box, FilterList, TextInput } from '@primer/components';
import { AGLCPart } from '../titles';
import { Index } from './Index';

export const Nav = ({parts, names, filterBasedOn, setSearch, clickFilter}: { parts: AGLCPart[]; names: Set<string>; filterBasedOn: TestUnit[]; setSearch: Function, clickFilter: Function }) => {
  let fItem = (names: Set<string>, matches: TestUnit[], fname: string, desc: string) => {
    const isSelected = names.has(fname);
    const theoretical = getFilter(new Set([fname]));
    const count = mapReduce(matches, (t) => theoretical(t) ? 1 : 0, (a, b) => a + b, 0);
    // if (count === 0) return null;
    return (
      <FilterList.Item
        selected={isSelected}
        count={count > 0 ? count : '0'} // weird bug with zero
        onClick={clickFilter(fname)}
        href='#'>{desc}</FilterList.Item>
    )
  }
  return (
    <Box is="nav" bg="gray.1" className="App-nav">
      <Box p={4} className="nav-sticky">
        <TextInput placeholder="Find a test" aria-label="Search" name="search" onChange={setSearch} block mb={1} />
        <FilterList small={true}>
          { fItem(names, filterBasedOn, 'passing', 'Passing tests') }
          { fItem(names, filterBasedOn, 'failing', 'Failing tests') }
          { fItem(names, filterBasedOn, 'stub', 'Stubs') }
          { fItem(names, filterBasedOn, 'doc', 'Has documentation') }
          {/* { fItem(filterBasedOn, 'single', 'Single tests') } */}
          {/* { fItem(filterBasedOn, 'sequence', 'Sequence tests') } */}
        </FilterList>
        <Index parts={parts} />
      </Box>
    </Box>
  )
}

