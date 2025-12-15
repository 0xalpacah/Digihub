CREATE TABLE `arc_resources` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`category` enum('node_provider','data_indexer','block_explorer','wallet','dev_tool') NOT NULL,
	`description` text,
	`url` varchar(500) NOT NULL,
	`logoUrl` varchar(500),
	`featured` boolean NOT NULL DEFAULT false,
	`order` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `arc_resources_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `blog_posts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`excerpt` text,
	`coverImage` varchar(500),
	`coverImageAlt` varchar(255),
	`categoryId` int NOT NULL,
	`authorId` int NOT NULL,
	`published` boolean NOT NULL DEFAULT false,
	`featured` boolean NOT NULL DEFAULT false,
	`viewCount` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`publishedAt` timestamp,
	CONSTRAINT `blog_posts_id` PRIMARY KEY(`id`),
	CONSTRAINT `blog_posts_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`slug` varchar(100) NOT NULL,
	`description` text,
	`color` varchar(7),
	`icon` varchar(50),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `categories_name_unique` UNIQUE(`name`),
	CONSTRAINT `categories_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `comments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`postId` int NOT NULL,
	`authorId` int NOT NULL,
	`content` text NOT NULL,
	`parentCommentId` int,
	`approved` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `comments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `creator_projects` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`imageUrl` varchar(500),
	`websiteUrl` varchar(500),
	`githubUrl` varchar(500),
	`twitterUrl` varchar(500),
	`creatorName` varchar(255) NOT NULL,
	`featured` boolean NOT NULL DEFAULT false,
	`order` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `creator_projects_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `network_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`eventType` enum('block','transaction','contract_deployment','token_transfer') NOT NULL,
	`blockNumber` int,
	`transactionHash` varchar(255),
	`fromAddress` varchar(255),
	`toAddress` varchar(255),
	`value` varchar(100),
	`gasUsed` varchar(100),
	`minerAddress` varchar(255),
	`metadata` json,
	`timestamp` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `network_events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `network_metrics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`bestBlock` int NOT NULL,
	`uncleCount` int NOT NULL,
	`lastBlockTime` timestamp,
	`avgBlockTime` int,
	`avgNetworkHashrate` varchar(100),
	`difficulty` varchar(100),
	`activeNodes` int,
	`totalNodes` int,
	`gasPrice` varchar(100),
	`gasLimit` varchar(100),
	`pageLatency` int,
	`uptime` decimal(5,2),
	`timestamp` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `network_metrics_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `post_tags` (
	`postId` int NOT NULL,
	`tagId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now())
);
--> statement-breakpoint
CREATE TABLE `tags` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(50) NOT NULL,
	`slug` varchar(50) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `tags_id` PRIMARY KEY(`id`),
	CONSTRAINT `tags_name_unique` UNIQUE(`name`),
	CONSTRAINT `tags_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `user_alerts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`content` text,
	`alertType` enum('network_event','new_post','creator_project','protocol_update') NOT NULL,
	`read` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `user_alerts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('user','admin','creator') NOT NULL DEFAULT 'user';