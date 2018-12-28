import slugify from 'slugify';
import groupBy from './groupBy';
import { TestUnit, TestCase } from './types';

export interface ParsedTitle {
  disambiguate: string;
  ruleId: string;
  major: number;
  minor: number;
  sub: number;
  section: string;
  rest: string;
}

export const parseTitle = (title: string): ParsedTitle => {
  let matches = title.match(/^((?:\d+\.)*\d+)\.? (?:(.+) > )?(.+)/)
  if (!matches) { return { disambiguate: title, ruleId: "", major: 0, minor: 0, sub: 0, section: "", rest: title } }
  let ruleId = matches[1] || "";
  let section = matches[2] || "";
  let rest = matches[3] || "";
  return { disambiguate: ruleId + " " + section, ruleId, ...parseRule(ruleId), section, rest };
}

export function parseRule(rule: string) {
  let segments = rule.split('.');
  let major = segments.length > 0 && +segments[0] || 0;
  let minor = segments.length > 1 && +segments[1] || 0;
  let sub = segments.length > 2 && +segments[2] || 0;
  return { major, minor, sub };
}

export type Parsed<T> = { parsed: ParsedTitle; content: T };
export interface AGLCPart { // Part III
  partNumber: number;
  partTitle: string;
  slug: string;
  chapters: AGLCChapter[];
}
export interface AGLCChapter { // 4
  chapterNumber: number;
  chapterTitle: string;
  slug: string;
  units: AGLCUnit[]
}
export interface AGLCUnit { // 4.1
  parsed: ParsedTitle;
  slug: string;
  rules: AGLCRule[];
}
export interface AGLCRule { // 4.1.3
  ruleTitle: string;
  ruleId: string;
  slug: string;
  tests: Parsed<TestCase>[];
}

export function unitsToTree(flatUnits: TestUnit[]) {
  let units: AGLCUnit[] = flatUnits.map(u => {
    const parsed = parseTitle(u.describe);
    // ignores section
    const slug = slugify(parsed.ruleId + " " + parsed.rest);
    const rules = coalesceRules(u.tests);
    return { parsed, slug, rules, }
  });
  let chapters = coalesceChapters(units);
  let parts = coalesceParts(chapters);
  return parts;
}

export function coalesceParts(flatChapters: AGLCChapter[]): AGLCPart[] {
  let gs: Map<number, AGLCChapter[]> =
    groupBy(flatChapters, (c: AGLCChapter) => chapterToPartNumber(c.chapterNumber));
  return [...gs.entries()].map(([partNumber, chapters]) => {
    let partTitle = getPartTitle(partNumber);
    const slug = slugify(partTitle);
    return { partTitle, partNumber, chapters, slug, }
  }).sort((a, b) => a.partNumber - b.partNumber);
}

export function coalesceChapters(flatUnits: AGLCUnit[]): AGLCChapter[] {
  let gs = groupBy(flatUnits, (t: AGLCUnit) => t.parsed.major);
  return [...gs.entries()].map(([key, units]) => {
    if (units.length === 0) throw new Error("impossible; groupBy doesn't return empty groups");
    const chapterTitle = chapterMap[key];
    const slug = slugify("" + key + " " + chapterTitle);
    return {
      chapterNumber: key,
      chapterTitle: chapterMap[key],
      slug,
      units,
    };
  }).sort((a, b) => a.chapterNumber - b.chapterNumber);
}

export function coalesceRules(tests: TestCase[]): AGLCRule[] {
  let ts: Parsed<TestCase>[] = tests.map(t => ({ parsed: parseTitle(t.it), content: t }));
  let gs: Map<string, Parsed<TestCase>[]> = groupBy(ts, (t: Parsed<TestCase>) => t.parsed.ruleId);
  return [...gs.entries()].map(([_, cases]) => {
    if (cases.length === 0) throw new Error("impossible; groupBy doesn't return empty groups")
    const first = cases[0].parsed;
    const slug = slugify(first.ruleId + " " + first.section);
    return {
      ruleTitle: first.section,
      ruleId: first.ruleId,
      tests: cases,
      slug
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


function chapterToPartNumber(chapter: number): number {
  if (chapter < 1) { return 0 }
  if (chapter < 2) { return 1 };
  if (chapter < 4) { return 2 };
  if (chapter < 8) { return 3 };
  if (chapter < 15) { return 4 };
  if (chapter < 27) { return 5 };
  return 0;
}
function getPartTitle(partNumber: number) {
  if (partNumber === 1) { return "Part I – General Rules" };
  if (partNumber === 2) { return "Part II – Domestic Sources" };
  if (partNumber === 3) { return "Part III – Secondary Sources" };
  if (partNumber === 4) { return "Part IV – International Materials" };
  if (partNumber === 5) { return "Part V – Foreign Domestic Sources" };
  return "";
}
