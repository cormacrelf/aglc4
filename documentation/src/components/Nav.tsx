import React from 'react';
import { TestUnit } from '../types';
import { mapReduce, getFilter } from '../filters';
import { Box, FilterList, TextInput } from '@primer/components';

export const Nav = ({units, names, filterBasedOn, setSearch, clickFilter}: { units: TestUnit[]; names: Set<string>; filterBasedOn: TestUnit[]; setSearch: Function, clickFilter: Function }) => {
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
    <Box is="nav" p={4} bg="gray.1" className="App-nav">
      <TextInput placeholder="Find a test" aria-label="Search" name="search" onChange={setSearch} block mb={1} />
      <FilterList>
        { fItem(names, filterBasedOn, 'passing', 'Passing tests') }
        { fItem(names, filterBasedOn, 'failing', 'Failing tests') }
        { fItem(names, filterBasedOn, 'stub', 'Stubs') }
        { fItem(names, filterBasedOn, 'doc', 'Has documentation') }
        {/* { fItem(filterBasedOn, 'single', 'Single tests') } */}
        {/* { fItem(filterBasedOn, 'sequence', 'Sequence tests') } */}
      </FilterList>
    </Box>
  )
}

