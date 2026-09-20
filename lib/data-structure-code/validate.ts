import { DATA_STRUCTURE_CHAPTERS, makeTopicId } from "./topic-catalog.ts";
import type { CodeLibraryValidationInput } from "./types.ts";

const isBlank = (value: string) => value.trim().length === 0;

export function validateCodeLibrary({ items, coverage }: CodeLibraryValidationInput): string[] {
  const errors: string[] = [];
  const knownTopics = new Map<string, { chapter: number; topic: string }>();
  DATA_STRUCTURE_CHAPTERS.forEach((chapter, chapterIndex) => {
    chapter.topics.forEach((topic, topicIndex) => {
      knownTopics.set(makeTopicId(chapterIndex + 1, topicIndex + 1), { chapter: chapterIndex + 1, topic });
    });
  });

  const itemIds = new Set<string>();
  for (const item of items) {
    if (itemIds.has(item.id)) errors.push(`duplicate code id: ${item.id}`);
    itemIds.add(item.id);

    if (!Number.isInteger(item.chapter) || item.chapter < 1 || item.chapter > DATA_STRUCTURE_CHAPTERS.length) {
      errors.push(`invalid chapter for code id: ${item.id}`);
    }
    const requiredStrings = [
      ["id", item.id], ["category", item.category], ["title", item.title], ["purpose", item.purpose],
      ["complexity", item.complexity], ["invariant", item.invariant], ["code", item.code],
    ] as const;
    for (const [field, value] of requiredStrings) {
      if (isBlank(value)) errors.push(`empty ${field} for code id: ${item.id}`);
    }
    if (item.topicIds.length === 0) errors.push(`empty topic ids for code id: ${item.id}`);
    if (item.prerequisites.length === 0) errors.push(`empty prerequisites for code id: ${item.id}`);
    if (item.steps.length < 2) errors.push(`fewer than two steps for code id: ${item.id}`);
    if (item.pitfalls.length === 0) errors.push(`empty pitfalls for code id: ${item.id}`);
    if (isBlank(item.textbookRef.section) || isBlank(item.textbookRef.pdfPages)) {
      errors.push(`empty textbook reference for code id: ${item.id}`);
    }
    for (const topicId of item.topicIds) {
      const topic = knownTopics.get(topicId);
      if (!topic) errors.push(`unknown topic id: ${topicId}`);
      else if (topic.chapter !== item.chapter) errors.push(`topic chapter mismatch: ${item.id} -> ${topicId}`);
    }
  }

  const coverageIds = new Set<string>();
  for (const record of coverage) {
    if (coverageIds.has(record.topicId)) errors.push(`duplicate coverage topic id: ${record.topicId}`);
    coverageIds.add(record.topicId);
    const expected = knownTopics.get(record.topicId);
    if (!expected) errors.push(`unknown coverage topic id: ${record.topicId}`);
    else {
      if (record.chapter !== expected.chapter) errors.push(`coverage chapter mismatch: ${record.topicId}`);
      if (record.topic !== expected.topic) errors.push(`coverage topic mismatch: ${record.topicId}`);
    }
    if (record.status === "theory") {
      if (record.codeIds.length > 0) errors.push(`theory topic has code: ${record.topicId}`);
      if (!record.reason || isBlank(record.reason)) errors.push(`missing theory reason: ${record.topicId}`);
    } else if (record.codeIds.length === 0) {
      errors.push(`non-theory topic without code: ${record.topicId}`);
    }
    for (const codeId of record.codeIds) {
      if (!itemIds.has(codeId)) errors.push(`unknown code id: ${codeId}`);
    }
  }

  for (const item of items) {
    for (const topicId of item.topicIds) {
      if (!coverageIds.has(topicId)) errors.push(`missing coverage: ${topicId}`);
    }
  }
  return errors;
}
