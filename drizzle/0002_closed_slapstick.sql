CREATE TABLE `collections` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`user_id` text,
	`timestamp` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `collections_of_books` (
	`collection_id` text NOT NULL,
	`book_id` text NOT NULL,
	PRIMARY KEY(`collection_id`, `book_id`),
	FOREIGN KEY (`collection_id`) REFERENCES `collections`(`id`) ON UPDATE CASCADE ON DELETE CASCADE,
	FOREIGN KEY (`book_id`) REFERENCES `books`(`id`) ON UPDATE CASCADE ON DELETE CASCADE
);
