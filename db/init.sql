CREATE DATABASE IF NOT EXISTS albionstatus;

CREATE TABLE IF NOT EXISTS `albionstatus`.`status` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `current_status` varchar(255) NOT NULL,
  `message` varchar(500) NOT NULL,
  `comment` varchar(500) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `created_at` (`created_at`)
)
