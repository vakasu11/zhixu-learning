import { chapter01Code } from "./chapters/chapter-01.ts";
import { chapter02Code } from "./chapters/chapter-02.ts";
import { chapter03Code } from "./chapters/chapter-03.ts";
import { chapter04Code } from "./chapters/chapter-04.ts";
import { chapter05Code } from "./chapters/chapter-05.ts";
import { chapter06Code } from "./chapters/chapter-06.ts";
import { chapter07Code } from "./chapters/chapter-07.ts";
import { chapter08Code } from "./chapters/chapter-08.ts";
import { chapter09Code } from "./chapters/chapter-09.ts";
import { chapter10Code } from "./chapters/chapter-10.ts";
import { chapter11Code } from "./chapters/chapter-11.ts";
import { chapter12Code } from "./chapters/chapter-12.ts";
import { chapter13Code } from "./chapters/chapter-13.ts";
import { chapter14Code } from "./chapters/chapter-14.ts";
import { chapter15Code } from "./chapters/chapter-15.ts";
import { chapter16Code } from "./chapters/chapter-16.ts";
import { chapter17Code } from "./chapters/chapter-17.ts";
import { chapter18Code } from "./chapters/chapter-18.ts";
import { chapter19Code } from "./chapters/chapter-19.ts";
import { chapter20Code } from "./chapters/chapter-20.ts";
import { chapter21Code } from "./chapters/chapter-21.ts";
import { buildTopicCoverage } from "./coverage.ts";
import { DATA_STRUCTURE_TOPIC_COUNT } from "./topic-catalog.ts";

export type { CodePriority, CodeReviewItem, TextbookReference, TopicCoverage, TopicCoverageStatus } from "./types.ts";

export const DATA_STRUCTURE_CODE_LIBRARY = [
  ...chapter01Code,
  ...chapter02Code,
  ...chapter03Code,
  ...chapter04Code,
  ...chapter05Code,
  ...chapter06Code,
  ...chapter07Code,
  ...chapter08Code,
  ...chapter09Code,
  ...chapter10Code,
  ...chapter11Code,
  ...chapter12Code,
  ...chapter13Code,
  ...chapter14Code,
  ...chapter15Code,
  ...chapter16Code,
  ...chapter17Code,
  ...chapter18Code,
  ...chapter19Code,
  ...chapter20Code,
  ...chapter21Code,
];

export const CODE_LIBRARY_CHAPTERS = Array.from(
  new Set(DATA_STRUCTURE_CODE_LIBRARY.map((item) => item.chapter)),
).sort((a, b) => a - b);

export const CODE_LIBRARY_CATEGORIES = Array.from(
  new Set(DATA_STRUCTURE_CODE_LIBRARY.map((item) => item.category)),
).sort((a, b) => a.localeCompare(b, "zh-CN"));

export const DATA_STRUCTURE_TOPIC_COVERAGE = buildTopicCoverage(DATA_STRUCTURE_CODE_LIBRARY);

export const CODE_LIBRARY_STATS = {
  totalChapters: CODE_LIBRARY_CHAPTERS.length,
  totalCodeItems: DATA_STRUCTURE_CODE_LIBRARY.length,
  totalTopics: DATA_STRUCTURE_TOPIC_COUNT,
  accountedTopics: DATA_STRUCTURE_TOPIC_COVERAGE.length,
  directTopics: DATA_STRUCTURE_TOPIC_COVERAGE.filter((item) => item.status === "code" || item.status === "experiment").length,
  relatedTopics: DATA_STRUCTURE_TOPIC_COVERAGE.filter((item) => item.status === "related").length,
};
