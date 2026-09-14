import { sql } from "drizzle-orm";
import { integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const studyTasks = sqliteTable("study_tasks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  visitorId: text("visitor_id").notNull().default("legacy"),
  courseId: text("course_id").notNull(), course: text("course").notNull(), title: text("title").notNull(),
  duration: integer("duration").notNull().default(30), kind: text("kind").notNull().default("学习"),
  completed: integer("completed", { mode: "boolean" }).notNull().default(false), position: integer("position").notNull().default(0),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const chatMessages = sqliteTable("chat_messages", {
  id: integer("id").primaryKey({ autoIncrement: true }), visitorId: text("visitor_id").notNull().default("legacy"), courseId: text("course_id").notNull(),
  role: text("role").notNull(), content: text("content").notNull(), createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const mastery = sqliteTable("mastery", {
  id: integer("id").primaryKey({ autoIncrement: true }), visitorId: text("visitor_id").notNull().default("legacy"), courseId: text("course_id").notNull(), topic: text("topic").notNull(),
  level: integer("level").notNull().default(0), updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [uniqueIndex("idx_mastery_visitor_course_topic").on(table.visitorId, table.courseId, table.topic)]);

export const resources = sqliteTable("resources", {
  id: integer("id").primaryKey({ autoIncrement: true }), visitorId: text("visitor_id").notNull().default("legacy"), courseId: text("course_id").notNull(), name: text("name").notNull(),
  storageKey: text("storage_key").notNull(), contentType: text("content_type").notNull().default("application/octet-stream"),
  size: integer("size").notNull().default(0), source: text("source").notNull().default("upload"), createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});
