export type CodePriority = "必会" | "重点理解" | "拓展";
export type TopicCoverageStatus = "code" | "experiment" | "related" | "theory";

export type TextbookReference = {
  section: string;
  pdfPages: string;
};

export type CodeReviewItem = {
  id: string;
  chapter: number;
  category: string;
  title: string;
  priority: CodePriority;
  topicIds: string[];
  prerequisites: string[];
  purpose: string;
  steps: string[];
  complexity: string;
  invariant: string;
  pitfalls: string[];
  textbookRef: TextbookReference;
  code: string;
};

export type TopicCoverage = {
  topicId: string;
  chapter: number;
  topic: string;
  status: TopicCoverageStatus;
  codeIds: string[];
  reason?: string;
};

export type CodeLibraryValidationInput = {
  items: CodeReviewItem[];
  coverage: TopicCoverage[];
};
