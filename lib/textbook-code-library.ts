import {
  OFFICIAL_TEXTBOOK_CODE,
  OFFICIAL_TEXTBOOK_PROGRAM_COUNT,
} from "./textbook-code-library.generated.ts";
import { getTextbookCodeGuide } from "./textbook-code-guides.ts";
export { getTextbookCodeGuide, type TextbookCodeGuide } from "./textbook-code-guides.ts";

export type TextbookCodeItem = (typeof OFFICIAL_TEXTBOOK_CODE)[number];

export const TEXTBOOK_CODE_LIBRARY = OFFICIAL_TEXTBOOK_CODE;
export const TEXTBOOK_CODE_CHAPTERS = Array.from({ length: 21 }, (_, index) => index + 1);
export const TEXTBOOK_CODE_SOURCE_URL = "https://www.cise.ufl.edu/~sahni/dsaac/programs.htm";

export const TEXTBOOK_CODE_STATS = {
  totalChapters: 21,
  totalPrograms: OFFICIAL_TEXTBOOK_PROGRAM_COUNT,
  totalSourceFiles: new Set(TEXTBOOK_CODE_LIBRARY.map((item) => item.sourceFile)).size,
  totalChapterFiles: TEXTBOOK_CODE_LIBRARY.length,
};

export function filterTextbookCodeItems(
  items: readonly TextbookCodeItem[],
  filters: { chapter: "all" | string; query: string },
) {
  const keyword = filters.query.trim().toLocaleLowerCase("zh-CN");
  return items.filter((item) => {
    const matchesChapter = filters.chapter === "all" || item.chapter === Number(filters.chapter);
    const guide = getTextbookCodeGuide(item);
    const searchableText = [
      item.sourceFile,
      ...item.programNumbers,
      item.code,
      guide.textbookScope,
      ...guide.prerequisites,
      ...guide.steps,
      guide.complexity,
      guide.invariant,
      ...guide.pitfalls,
    ]
      .join(" ")
      .toLocaleLowerCase("zh-CN");
    return matchesChapter && (!keyword || searchableText.includes(keyword));
  });
}

export function formatProgramNumbers(programNumbers: readonly string[]) {
  if (programNumbers.length === 1) return `程序 ${programNumbers[0]}`;
  return `程序 ${programNumbers.join("、")}`;
}
