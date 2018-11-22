import { TestUnit, TestCase } from './types';

export type TestFilter = (test: TestCase) => boolean;

export function mapReduce<T, A>(units: TestUnit[], mapper: (t: TestCase) => T, reducer: (acc: A, b: T) => A, initial: A) {
  let tests = units.map(unit => unit.tests.map(mapper));
  return Array.prototype.concat.apply([], tests).reduce(reducer, initial);
}

export const filterMap: { [k: string]: TestFilter } = {
  'doc': t => t.meta && (
    t.meta.doc || t.meta.pandoc || t.meta.zotero || t.meta.jurisM
  ) && true || false,
  'stub': t => t.type === 'stub',
  'single': t => t.type === 'single',
  'sequence': t => t.type === 'sequence',
  'passing': t => t.passed && t.type !== 'stub' && t.type !== 'doc',
  'failing': t => !t.passed && t.type !== 'stub' && t.type !== 'doc',
};

export const getFilter = (filterSet: Set<string>) => {
  return (t: TestCase) => {
    let acc = true;
    for (let fn of filterSet) {
      acc = acc && filterMap[fn](t);
    }
    return acc;
  }
}

export function runFilter(units: TestUnit[], f: TestFilter) {
  return units.map(unit => {
    return {
      ...unit,
      tests: unit.tests.filter(f)
    }
  }).filter(unit => unit.tests.length > 0);
}

