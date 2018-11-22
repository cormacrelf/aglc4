import { AGLCRule, parseTitle } from '../titles';
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
        item: {},
        slug: 'slug',
        meta: {
          doc: `Yeah mate`
        }
      }
    },
    {
      parsed: parseTitle('1.2.3 Rule Title > Test case'),
      content: {
        it: '1.2.3 Rule Title > Second test case ',
        type: 'single',
        single: { id: 'citekey' },
        expect: 'Expected result',
        result: 'Actual result',
        passed: false,
        item: {},
        slug: 'slug',
        meta: {
          doc: `Yeah mate`
        }
      }
    }
  ]
};
