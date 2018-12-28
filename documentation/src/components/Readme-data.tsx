import React from 'react';
import { AGLCRule, parseTitle } from '../titles';
import { Rule } from './Results';
import { LibraryContext, IsJurisMContext } from './LibraryContext';
import { Library } from '../types';
export const demoLibrary: Library = {
  'citekey': {
    type: 'book',
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
        doc: [{ label: "Note", content: "Some notes on using this rule." }]
      }
    },
    {
      parsed: parseTitle('1.2.3 Rule Title > Second test case'),
      content: {
        it: '1.2.3 Rule Title > Second test case ',
        type: 'single',
        single: { id: 'citekey', locator: '53' },
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
      <IsJurisMContext.Provider value={false}>
        <Rule rule={demoRule} />
      </IsJurisMContext.Provider>
  </LibraryContext.Provider>
)
