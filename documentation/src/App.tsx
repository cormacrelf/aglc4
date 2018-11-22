import React from 'react';
import './App.scss';
import { Box, Flex, UnderlineNav, Tooltip } from '@primer/components';
import { TestUnit } from './types';
import { TestResultsView } from './components/TestResultsView';
import aglcLogo from './aglc-logo.jpg';
import { Markdown } from './components/Markdown';
import {BrowserRouter, Route, NavLink, Switch, Redirect} from 'react-router-dom';
import asyncProps from './asyncProps';

// /* eslint-disable import/no-webpack-loader-syntax */
// import Content from '!babel-loader!@mdx-js/loader!./Readme.mdx';
// <Content />

const Readme = () => {
  return (
    <Box p={4}>
      <Markdown source={"readme"} />
    </Box>
  )
}

const AsyncResults = ({ title, results }: { title: string, results: Promise<{ default: any }> }) => {
  const AsyncRes = asyncProps(TestResultsView, {
    results: results.then(r => r.default as TestUnit[])
  })
  return <AsyncRes title={title} />
}

const CSLResults = () => {
  return <AsyncResults
    title="Basic CSL for use with Zotero and Mendeley"
    results={ import('./results-csl.json') }
    />;
}

const JurisMResults = () => {
  return <AsyncResults
    title="Extended CSL-M for use with Juris-M"
    results={ import('./results-jurisM.json') }
    />;
}

const App = () => {
  return (
    <BrowserRouter>
      <div className="App">
        <Flex is="header" className="App-header" color="gray.0" p={3} alignItems={'center'}>
          <img width={100} src={aglcLogo} />
          <h1>AGLC 4 Automated Citation Guide</h1>
        </Flex>
        <Box is="header" p={3} pt={0}>
          <UnderlineNav
            align="right"
            label="CSL or CSL-M"
            actions={ <h2 id="csl-title" className="underline-header"></h2> }>
            <UnderlineNav.Link is={NavLink} to="/readme">
              Readme
            </UnderlineNav.Link>
            <UnderlineNav.Link is={NavLink} to="/csl">
              <Tooltip direction="ne" text="Basic; for use with Zotero and Mendeley">
                CSL
              </Tooltip>
            </UnderlineNav.Link>
            <UnderlineNav.Link is={NavLink} to="/csl-m">
              <Tooltip direction="ne" text="Extended; for use with Juris-M">
                CSL-M
              </Tooltip>
            </UnderlineNav.Link>
          </UnderlineNav>
        </Box>
        <div className="App-body">
          <Switch>
            <Redirect exact from="/" to="/csl" />
            <Route exact path="/csl" component={CSLResults} />
            <Route exact path="/csl-m" component={JurisMResults} />
            <Route exact path="/readme" component={Readme} />
            <Redirect to="/readme" />
          </Switch>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App;

