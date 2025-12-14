CREATE DATABASE IF NOT EXISTS pinterest;
USE pinterest;

CREATE TABLE IF NOT EXISTS `users` (
  `userId` int NOT NULL AUTO_INCREMENT,
  `userName` varchar(255) DEFAULT NULL UNIQUE,
  `fullName` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `phoneNumber` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `images` (
  `imageId` int NOT NULL AUTO_INCREMENT,
  `imageName` varchar(255) DEFAULT NULL,
  `imageUrl` varchar(255) DEFAULT NULL,
  `users_id` int DEFAULT NULL,
  PRIMARY KEY (`imageId`),
  KEY `users_id` (`users_id`),
  CONSTRAINT `images_ibfk_1` FOREIGN KEY (`users_id`) REFERENCES `users` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `comments` (
  `commentId` int NOT NULL AUTO_INCREMENT,
  `content` varchar(255) DEFAULT NULL,
  `users_id` int DEFAULT NULL,
  `images_id` int DEFAULT NULL,
  PRIMARY KEY (`commentId`),
  KEY `users_id` (`users_id`),
  KEY `images_id` (`images_id`),
  CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`users_id`) REFERENCES `users` (`userId`),
  CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`images_id`) REFERENCES `images` (`imageId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `saved` (
  `isSaved` int DEFAULT NULL,
  `users_id` int NOT NULL,
  `images_id` int NOT NULL,
  PRIMARY KEY (`users_id`,`images_id`),
  KEY `images_id` (`images_id`),
  CONSTRAINT `saved_ibfk_1` FOREIGN KEY (`users_id`) REFERENCES `users` (`userId`) ON DELETE CASCADE,
  CONSTRAINT `saved_ibfk_2` FOREIGN KEY (`images_id`) REFERENCES `images` (`imageId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;