import React from 'react';
import { AGLCRule, parseTitle } from '../titles';
import { Rule } from './Results';
import { LibraryContext } from './LibraryContext';
import { Library } from '../types';
export const demoLibrary: Library = {
  'citekey': {
    author: { first: 'John', last: 'Doe' },
    title: "Miscellaneous Writings",
    issued: { "year": 2001 }
  }
};

export const demoRule: AGLCRule = {
  ruleTitle: 'Rule Title',
  ruleId: '1.2.3',
  slug: '1.2.3-Rule-Title',
  tests: [
    {
      parsed: parseTitle('1.2.3 Rule Title > Test case'),
      content: {
        it: '1.2.3 Rule Title > Test case',
        type: 'single',
        single: { id: 'citekey' },
        expect: 'Expected result',
        result: 'Expected result',
        passed: true,
        slug: 'slug',
        doc: [""]
      }
    },
    {
      parsed: parseTitle('1.2.3 Rule Title > Second test case'),
      content: {
        it: '1.2.3 Rule Title > Second test case ',
        type: 'single',
        single: { id: 'citekey' },
        expect: 'Expected result',
        result: 'Actual result',
        passed: false,
        slug: 'slug',
        doc: [""]
      }
    }
  ]
};

export const DemoRule = () => (
  <LibraryContext.Provider value={demoLibrary}>
    <Rule rule={demoRule} />
  </LibraryContext.Provider>
)
