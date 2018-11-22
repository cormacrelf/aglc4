
export interface CiteItem {
  id: string;
  locator?: string;
  label?: string;
  prefix?: string;
  suffix?: string;
}
export interface TestCaseBase {
  it: string;
  passed: boolean;
  slug: string;
  format?: 'text' | 'html';
  meta?: {
    doc?: string,
    pandoc?: string
    zotero?: string
    jurisM?: string
  }
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
  item: object;
}
export interface CiteCluster {
  cluster: Array<CiteItem>;
}
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

