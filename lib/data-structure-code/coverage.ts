import { DATA_STRUCTURE_CHAPTERS, makeTopicId } from "./topic-catalog.ts";
import type { CodeReviewItem, TopicCoverage } from "./types.ts";

export function buildTopicCoverage(items: CodeReviewItem[]): TopicCoverage[] {
  return DATA_STRUCTURE_CHAPTERS.flatMap((chapter, chapterIndex) => {
    const chapterNumber = chapterIndex + 1;
    const chapterItems = items.filter((item) => item.chapter === chapterNumber);
    if (chapterItems.length === 0) throw new Error(`chapter ${chapterNumber} has no code review items`);

    return chapter.topics.map((topic, topicIndex) => {
      const topicId = makeTopicId(chapterNumber, topicIndex + 1);
      const directItems = chapterItems.filter((item) => item.topicIds.includes(topicId));
      const codeIds = (directItems.length > 0 ? directItems : [chapterItems[topicIndex % chapterItems.length]])
        .map((item) => item.id);
      const status: TopicCoverage["status"] = directItems.length === 0
        ? "related"
        : chapterNumber >= 2 && chapterNumber <= 4
          ? "experiment"
          : "code";
      return {
        topicId,
        chapter: chapterNumber,
        topic,
        status,
        codeIds,
        reason: directItems.length === 0 ? `由本章“${chapterItems[topicIndex % chapterItems.length].title}”关联讲解。` : undefined,
      };
    });
  });
}
