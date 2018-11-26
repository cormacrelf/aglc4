export interface TestResults {
  library: Library;
  units: TestUnit[];
}

type LibraryItem = any;

export interface Library {
  [k: string]: LibraryItem;
}

export interface CiteItem {
  id: string;
  locator?: string;
  label?: string;
  prefix?: string;
  suffix?: string;
}
export interface DocSection {
  label: string;
  content: string;
}
export interface TestCaseBase {
  it: string;
  passed: boolean;
  slug: string;
  format?: 'text' | 'html';
  doc?: string | Array<string | DocSection>;
  meta?: any;
}
export interface TestCaseStub extends TestCaseBase {
  type: 'stub';
}
export interface TestCaseDocOnly extends TestCaseBase {
  type: 'doc';
}
export interface TestCaseSingle extends TestCaseBase {
  type: 'single';
  single: CiteItem;
  expect: string;
  result: string;
}
export type CiteCluster = Array<CiteItem>;
export interface TestCaseSequence extends TestCaseBase {
  type: 'sequence';
  sequence: Array<CiteCluster>;
  expect: Array<string>;
  result: Array<string>;
}
export type TestCase = TestCaseSingle | TestCaseSequence | TestCaseStub | TestCaseDocOnly;
export interface TestUnit {
  describe: string;
  slug: string;
  tests: Array<TestCase>
}

