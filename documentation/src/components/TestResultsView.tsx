import React, { Component } from 'react';
import { runFilter, getFilter } from '../filters';
import { Nav } from './Nav';
import { Results } from './Results';
import { TitlePortal } from './TitlePortal';
import { unitsToTree } from '../titles';
import { TestResults } from '../types';

export class TestResultsView extends Component<{ results: TestResults, title: string }, { filterNames: Set<string>, search: string }> {

  constructor(props: { results: TestResults, title: string }) {
    super(props);
    this.state = { filterNames: new Set(), search: "" };
    this.clickFilter = this.clickFilter.bind(this);
    this.setSearch = this.setSearch.bind(this);
  }

  clickFilter(fname: string) {
    return (e: MouseEvent) => {
      e.preventDefault();
      let neu = new Set(this.state.filterNames);
      let has = this.state.filterNames.has(fname);
      if (has) { neu = new Set(); }
      else { neu = new Set([fname]); }
      // drill-down behaviour
      // if (has) { neu.delete(fname); }
      // else { neu.add(fname); }
      this.setState({ filterNames: neu });
    }
  }

  setSearch(ev: any) {
    this.setState({ search: ev.target.value });
  }

  render() {
    const { filterNames } = this.state;
    const searchMatches = runFilter(this.props.results.units, test => this.state.search == "" || new RegExp(this.state.search.toLowerCase()).test(test.it.toLowerCase()));
    const matches = runFilter(searchMatches, getFilter(filterNames));
    const parts = unitsToTree(matches);
    return (
      <>
        <TitlePortal title={this.props.title} />
        <Results parts={parts} library={this.props.results.library} />
        {/* drill-down mode: set filterBasedOn={matches} */}
        <Nav names={filterNames} filterBasedOn={searchMatches} setSearch={this.setSearch} clickFilter={this.clickFilter} parts={parts} />
      </>
    );
  }
}

