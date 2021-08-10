CREATE DATABASE `Plantboter`;

CREATE TABLE `Users` (
    `id` int unsigned PRIMARY KEY AUTO_INCREMENT,
    `email` varchar(50) NOT NULL UNIQUE,
    `password` varchar(255) NOT NULL,
    `admin` BOOLEAN NOT NULL DEFAULT 0,
    `session` varchar(255),
    `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
);

CREATE TABLE `Controllers` (
    `id` int unsigned PRIMARY KEY AUTO_INCREMENT,
    `user_id` int unsigned NOT NULL,
    `name` varchar(50) NOT NULL,
    `cycle_time` smallint unsigned NOt NULL DEFAULT 30000,
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `Users`(`id`)
);

CREATE TABLE `ApiKeys` (
    `id` int unsigned PRIMARY KEY AUTO_INCREMENT,
    `controller_id` int unsigned NOT NULL,
    `key` varchar(255) NOT NULL UNIQUE,
    `active` BOOLEAN DEFAULT 1,
    `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`controller_id`) REFERENCES `Controllers`(`id`)
);

CREATE TABLE `Plants` (
    `id` int unsigned PRIMARY KEY AUTO_INCREMENT,
    `controller_id` int unsigned NOT NULL,
    `sensor_pin` varchar(3),
    `pump_pin` varchar(3),
    `triger_percentage` smallint unsigned NOT NULL DEFAULT 40,
    `sensor_type` enum(`digital`, `analog`) NOT NULL,
    `pump_type` mediumint unsigned NOT NULL,
    `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`controller_id`) REFERENCES `Controllers`(`id`)
);

CREATE TABLE `Logs` (
    `id` bigint unsigned PRIMARY KEY AUTO_INCREMENT,
    `log_source` enum(`plant`, `controller`) NOT NULL,
    `plant_id` int unsigned,
    `controller_id`int unsigned,
    `type` enum(`moisture_level`, `pump_action`, `system_boot`) NOT NULL,
    `data` json NOT NULL,
    `api_key_id` int unsigned NOT NULL,
    `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`plant_id`) REFERENCES `Plants`(`id`),
    FOREIGN KEY (`controller_id`) REFERENCES `Controllers`(`id`),
    FOREIGN KEY (`api_key_id`) REFERENCES `ApiKeys`(`id`)
);

CREATE TABLE `DatabaseVersion` (
    `id` smallint unsigned PRIMARY KEY AUTO_INCREMENT,
    `version` smallint NOT NULL,
    `created_at` timestamp DEFAULT CURRENT_TIMESTAMP
);
