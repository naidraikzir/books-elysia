CREATE TABLE `books` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`author` text,
	`cover` text,
	`timestamp` text DEFAULT CURRENT_TIMESTAMP
);
