import groupBy from './groupBy';
import { TestUnit, TestCase } from './types';

export interface ParsedTitle {
  disambiguate: string;
  rule: string;
  major: number;
  minor: number;
  sub: number;
  section: string;
  rest: string;
}

export const parseTitle = (title: string): ParsedTitle => {
  let matches = title.match(/^((?:\d+\.)*\d+)\.? (?:(.+) > )?(.+)/)
  if (!matches) { return { disambiguate: title, rule: "", major: 0, minor: 0, sub: 0, section: "", rest: title } }
  let rule = matches[1];
  let section = matches[2];
  let rest = matches[3];
  return { disambiguate: rule + " " + section, rule, ...parseRule(rule), section, rest };
}

export function parseRule(rule: string) {
  let segments = rule.split('.');
  let major = segments.length > 0 && +segments[0] || 0;
  let minor = segments.length > 1 && +segments[1] || 0;
  let sub = segments.length > 2 && +segments[2] || 0;
  return { major, minor, sub };
}

export type Parsed<T> = { parsed: ParsedTitle; content: T };
interface Part {
  partTitle: string;
  chapters: AGLCChapter[];
}
export interface AGLCChapter {
  chapterNumber: number;
  chapterTitle: string;
  units: Parsed<TestUnit>[]
}
export interface AGLCRuleGroup {
  groupTitle: string;
  groupRule: string;
  tests: Parsed<TestCase>[];
}

export function coalesceParts(chapters: AGLCChapter[]): Part[] {
  let ts = chapters.map(ch => ({ partTitle: chapterToPart(ch.chapterNumber), chapter: ch }));
  let gs: Map<string, { part: string, chapter: AGLCChapter }[]> = groupBy(ts, (t: any) => t.partTitle);
  return [...gs.entries()].map(([partTitle, es]) => {
    return { partTitle, chapters: es.map(e => e.chapter) }
  });
}

export function coalesceChapters(units: TestUnit[]): AGLCChapter[] {
  let ts = units.map(t => ({ parsed: parseTitle(t.describe), content: t }));
  let gs: Map<number, Parsed<TestUnit>[]> = groupBy(ts, (t: Parsed<TestUnit>) => t.parsed.major) 
  return [...gs.entries()].map(([key, units]) => {
    if (units.length === 0) throw new Error("impossible; groupBy doesn't return empty groups")
    return {
      chapterNumber: key,
      chapterTitle: chapterMap[key],
      units: units,
    };
  });
}

export function coalesceRules(tests: TestCase[]): AGLCRuleGroup[] {
  let ts: Parsed<TestCase>[] = tests.map(t => ({ parsed: parseTitle(t.it), content: t }));
  let gs: Map<string, Parsed<TestCase>[]> = groupBy(ts, (t: Parsed<TestCase>) => t.parsed.rule);
  return [...gs.entries()].map(([_, cases]) => {
    if (cases.length === 0) throw new Error("impossible; groupBy doesn't return empty groups")
    let first = cases[0].parsed;
    return {
      groupTitle: first.section,
      groupRule: first.rule,
      tests: cases,
    };
  });
}

export const chapterMap: {[k: number]: string} = {
  // Part I - General Rules
  1: "General Rules",
  // Part II - Domestic Sources
  2: "Cases",
  3: "Legislative Materials",
  // Part III - Secondary Sources
  4: "General Rules for Citing Secondary Sources",
  5: "Journal Articles",
  6: "Books",
  7: "Other Sources",
  // Part IV - International Materials
  8: "Treaties",
  9: "United Nations Materials",
  10: "International Court of Justice and Permanent Court of International Justice",
  11: "International Arbitral and Tribunal Decisions",
  12: "International Criminal Tribunals and Courts",
  13: "International Economic Materials",
  14: "Supranational Materials",
  // Part V - Foreign Domestic Sources
  15: "Canada",
  16: "China",
  17: "France",
  18: "Germany",
  19: "Hong Kong",
  20: "Malaysia",
  21: "New Zealand",
  22: "Singapore",
  23: "South Africa",
  24: "United Kingdom",
  25: "United States of America",
  26: "Other Foreign Domestic Materials",
}

function chapterToPart(chapter: number) {
  if (chapter < 1) { return "" }
  if (chapter < 2) { return "Part I - General Rules" };
  if (chapter < 4) { return "Part II - Domestic Sources" };
  if (chapter < 8) { return "Part III - Secondary Sources" };
  if (chapter < 15) { return "Part IV - International Materials" };
  if (chapter < 27) { return "Part V - Foreign Domestic Sources" };
  return "";
}

