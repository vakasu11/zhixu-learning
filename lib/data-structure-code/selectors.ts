import type { CodePriority, CodeReviewItem } from "./types.ts";

export type CodeLibraryFilters = {
  chapter: "all" | string;
  category: "all" | string;
  priority: "all" | CodePriority;
  query: string;
};

export function filterCodeItems(items: CodeReviewItem[], filters: CodeLibraryFilters) {
  const keyword = filters.query.trim().toLocaleLowerCase("zh-CN");
  return items.filter((item) => {
    const text = [
      item.title, item.category, item.purpose, item.complexity, item.invariant,
      item.textbookRef.section, ...item.prerequisites, ...item.steps, ...item.pitfalls,
    ].join(" ").toLocaleLowerCase("zh-CN");
    return (filters.chapter === "all" || item.chapter === Number(filters.chapter))
      && (filters.category === "all" || item.category === filters.category)
      && (filters.priority === "all" || item.priority === filters.priority)
      && (!keyword || text.includes(keyword));
  }).sort((a, b) => a.chapter - b.chapter || a.title.localeCompare(b.title, "zh-CN"));
}

export function getVisibleCategories(items: CodeReviewItem[], chapter: "all" | string) {
  return Array.from(new Set(items
    .filter((item) => chapter === "all" || item.chapter === Number(chapter))
    .map((item) => item.category)))
    .sort((a, b) => a.localeCompare(b, "zh-CN"));
}
