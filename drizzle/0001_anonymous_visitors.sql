ALTER TABLE `study_tasks` ADD `visitor_id` text DEFAULT 'legacy' NOT NULL;
--> statement-breakpoint
ALTER TABLE `chat_messages` ADD `visitor_id` text DEFAULT 'legacy' NOT NULL;
--> statement-breakpoint
ALTER TABLE `mastery` ADD `visitor_id` text DEFAULT 'legacy' NOT NULL;
--> statement-breakpoint
ALTER TABLE `resources` ADD `visitor_id` text DEFAULT 'legacy' NOT NULL;
--> statement-breakpoint
DROP INDEX `idx_mastery_course_topic`;
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_mastery_visitor_course_topic` ON `mastery` (`visitor_id`,`course_id`,`topic`);
