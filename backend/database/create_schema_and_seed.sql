DROP DATABASE IF EXISTS online_courses;
CREATE DATABASE online_courses CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE online_courses;

-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: online_courses
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cart_items`
--

DROP TABLE IF EXISTS `cart_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `course_id` int NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ux_user_course` (`user_id`,`course_id`),
  KEY `fk_cart_course` (`course_id`),
  CONSTRAINT `fk_cart_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_cart_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_items`
--

LOCK TABLES `cart_items` WRITE;
/*!40000 ALTER TABLE `cart_items` DISABLE KEYS */;
INSERT INTO `cart_items` VALUES (20,2,2,1,'2025-11-21 09:25:11','2025-11-21 09:25:11'),(21,2,1,3,'2025-11-21 09:26:00','2025-11-21 09:26:02'),(24,3,1,1,'2025-11-21 09:38:09','2025-11-21 09:38:09');
/*!40000 ALTER TABLE `cart_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `courses`
--

DROP TABLE IF EXISTS `courses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `courses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `price` decimal(10,2) NOT NULL DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `courses`
--

LOCK TABLES `courses` WRITE;
/*!40000 ALTER TABLE `courses` DISABLE KEYS */;
INSERT INTO `courses` VALUES (1,'Angular Basics','Learn Angular',19.99,'2025-11-20 15:44:07','2025-11-20 15:44:07'),(2,'Node.js API','Backend APIs',24.99,'2025-11-20 15:44:07','2025-11-20 15:44:07'),(3,'Fullstack Course','E2E Project',39.99,'2025-11-20 15:44:07','2025-11-20 15:44:07');
/*!40000 ALTER TABLE `courses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_courses`
--

DROP TABLE IF EXISTS `order_courses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_courses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `course_id` int NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `price_at_purchase` decimal(10,2) NOT NULL DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ux_order_course` (`order_id`,`course_id`),
  KEY `fk_oc_course` (`course_id`),
  CONSTRAINT `fk_oc_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_oc_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_courses`
--

LOCK TABLES `order_courses` WRITE;
/*!40000 ALTER TABLE `order_courses` DISABLE KEYS */;
INSERT INTO `order_courses` VALUES (1,1,1,4,19.99,'2025-11-21 08:15:29','2025-11-21 08:15:29'),(2,2,1,3,19.99,'2025-11-21 09:09:16','2025-11-21 09:09:16'),(3,3,1,2,19.99,'2025-11-21 09:12:48','2025-11-21 09:12:48'),(4,4,2,1,24.99,'2025-11-21 09:15:36','2025-11-21 09:15:36'),(5,5,1,1,19.99,'2025-11-21 09:16:51','2025-11-21 09:16:51'),(6,5,2,8,24.99,'2025-11-21 09:16:51','2025-11-21 09:16:51');
/*!40000 ALTER TABLE `order_courses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `stripe_session_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `currency` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'usd',
  `status` enum('pending','paid','failed','cancelled') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'pending',
  `paid_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_order_user` (`user_id`),
  CONSTRAINT `fk_order_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,2,'mock_c8f90069a3e91153',79.96,'usd','paid','2025-11-21 08:15:29','2025-11-21 08:15:29','2025-11-21 08:15:29'),(2,2,'mock_16a39e6d61a99688',59.97,'usd','paid','2025-11-21 09:09:16','2025-11-21 09:09:16','2025-11-21 09:09:16'),(3,2,'mock_0bf5dc9892d02b14',39.98,'usd','paid','2025-11-21 09:12:48','2025-11-21 09:12:48','2025-11-21 09:12:48'),(4,2,'mock_853dec42e2f5e948',24.99,'usd','paid','2025-11-21 09:15:36','2025-11-21 09:15:36','2025-11-21 09:15:36'),(5,2,'mock_8442d609fb93c1fc',219.91,'usd','paid','2025-11-21 09:16:51','2025-11-21 09:16:51','2025-11-21 09:16:51');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'ashwini','ashwini0suresh@gmail','$2b$10$X6mLs9p3wklvb5frlf27Ce.To7G6IlFUVG46FTvucwu1gVV1RRkT6','2025-11-20 16:10:20','2025-11-20 16:10:20'),(2,'shaju','v.jshejmil@gmail.com','$2b$10$26A8ADnu8YEbQPw0dnvyr.hxiiyPNbFkkaUMaAtJDD4IO/STKMxRu','2025-11-20 16:11:08','2025-11-20 16:11:08'),(3,'test','test@123','$2b$10$nmHm50mOHgZ420OSWavqY.aXnSVjpJs03GmV6xU5dE3QsZBUvaYme','2025-11-21 09:34:09','2025-11-21 09:34:09');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-21 15:27:02


DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_cart_add_or_increment`(
  IN p_user_id INT,
  IN p_course_id INT,
  IN p_quantity INT
)
BEGIN
  INSERT INTO cart_items (user_id, course_id, quantity)
  VALUES (p_user_id, p_course_id, GREATEST(1, p_quantity))
  ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity);

  SELECT
    ci.id AS cart_item_id,
    ci.user_id,
    ci.course_id,
    ci.quantity,
    ci.created_at,
    ci.updated_at,
    c.title AS course_title,
    c.description AS course_description,
    c.price AS course_price,
    c.created_at AS course_created_at,
    c.updated_at AS course_updated_at
  FROM cart_items ci
  INNER JOIN courses c ON c.id = ci.course_id
  WHERE ci.user_id = p_user_id AND ci.course_id = p_course_id
  LIMIT 1;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_cart_clear`(IN p_user_id INT)
BEGIN
  DELETE FROM cart_items WHERE user_id = p_user_id;
  SELECT ROW_COUNT() AS affected_rows;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_cart_get_by_user`(IN p_user_id INT)
BEGIN
  SELECT
    ci.id AS cart_item_id,
    ci.user_id,
    ci.course_id,
    ci.quantity,
    ci.created_at,
    ci.updated_at,
    c.title AS course_title,
    c.description AS course_description,
    c.price AS course_price,
    c.created_at AS course_created_at,
    c.updated_at AS course_updated_at
  FROM cart_items ci
  INNER JOIN courses c ON c.id = ci.course_id
  WHERE ci.user_id = p_user_id
  ORDER BY ci.created_at DESC;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_cart_remove_by_course`(
  IN p_user_id INT,
  IN p_course_id INT
)
BEGIN
  DELETE FROM cart_items
  WHERE user_id = p_user_id AND course_id = p_course_id;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_cart_remove_item`(
  IN p_cart_item_id INT,
  IN p_user_id INT
)
BEGIN
  DELETE FROM cart_items
  WHERE id = p_cart_item_id AND user_id = p_user_id;

  SELECT ROW_COUNT() AS affected_rows;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_courses_get_by_id`(IN p_id INT)
BEGIN
  SELECT id, title, description, price, created_at, updated_at
  FROM courses
  WHERE id = p_id
  LIMIT 1;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_courses_list`()
BEGIN
  SELECT id, title, description, price, created_at, updated_at
  FROM courses
  ORDER BY created_at DESC;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_courses_seed_defaults`()
BEGIN
  IF (SELECT COUNT(*) FROM courses) = 0 THEN
    INSERT INTO courses (title, description, price)
    VALUES
      ('Angular Basics', 'Learn Angular', 19.99),
      ('Node.js API', 'Backend APIs', 24.99),
      ('Fullstack Course', 'E2E Project', 39.99);
  END IF;
  SELECT COUNT(*) AS course_count FROM courses;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_orders_create`(
  IN p_user_id INT,
  IN p_stripe_session_id VARCHAR(255),
  IN p_amount DECIMAL(10,2),
  IN p_currency VARCHAR(10),
  IN p_status VARCHAR(20)
)
BEGIN
  INSERT INTO orders (user_id, stripe_session_id, amount, currency, status)
  VALUES (p_user_id, p_stripe_session_id, p_amount, p_currency, p_status);

  SELECT *
  FROM orders
  WHERE id = LAST_INSERT_ID();
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_orders_finalize`(
  IN p_order_id INT,
  IN p_user_id INT
)
BEGIN
  UPDATE orders
  SET status = 'paid',
      paid_at = IFNULL(paid_at, NOW())
  WHERE id = p_order_id AND user_id = p_user_id;

  DELETE FROM cart_items
  WHERE user_id = p_user_id
    AND course_id IN (
      SELECT course_id FROM order_courses WHERE order_id = p_order_id
    );

  SELECT *
  FROM orders
  WHERE id = p_order_id
  LIMIT 1;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_orders_get_by_session`(
  IN p_user_id INT,
  IN p_session_id VARCHAR(255)
)
BEGIN
  SELECT *
  FROM orders
  WHERE user_id = p_user_id AND stripe_session_id = p_session_id
  LIMIT 1;

  SELECT
    oc.*,
    c.title AS course_title,
    c.description AS course_description,
    c.price AS course_price,
    c.created_at AS course_created_at,
    c.updated_at AS course_updated_at
  FROM order_courses oc
  INNER JOIN courses c ON c.id = oc.course_id
  INNER JOIN orders o ON o.id = oc.order_id
  WHERE o.user_id = p_user_id AND o.stripe_session_id = p_session_id;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_orders_get_paid`(IN p_user_id INT)
BEGIN
  SELECT *
  FROM orders
  WHERE user_id = p_user_id AND status = 'paid'
  ORDER BY paid_at DESC;

  SELECT
    oc.*,
    c.title AS course_title,
    c.description AS course_description,
    c.price AS course_price,
    c.created_at AS course_created_at,
    c.updated_at AS course_updated_at
  FROM order_courses oc
  INNER JOIN courses c ON c.id = oc.course_id
  INNER JOIN orders o ON o.id = oc.order_id
  WHERE o.user_id = p_user_id AND o.status = 'paid';
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_orders_get_with_items`(IN p_order_id INT)
BEGIN
  SELECT *
  FROM orders
  WHERE id = p_order_id
  LIMIT 1;

  SELECT
    oc.*,
    c.title AS course_title,
    c.description AS course_description,
    c.price AS course_price,
    c.created_at AS course_created_at,
    c.updated_at AS course_updated_at
  FROM order_courses oc
  INNER JOIN courses c ON c.id = oc.course_id
  WHERE oc.order_id = p_order_id;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_order_items_insert`(
  IN p_order_id INT,
  IN p_course_id INT,
  IN p_quantity INT,
  IN p_price DECIMAL(10,2)
)
BEGIN
  INSERT INTO order_courses (order_id, course_id, quantity, price_at_purchase)
  VALUES (p_order_id, p_course_id, p_quantity, p_price)
  ON DUPLICATE KEY UPDATE
    quantity = VALUES(quantity),
    price_at_purchase = VALUES(price_at_purchase);
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_users_create`(
  IN p_name VARCHAR(200),
  IN p_email VARCHAR(255),
  IN p_password VARCHAR(255)
)
BEGIN
  INSERT INTO users(name, email, password)
  VALUES(p_name, p_email, p_password);

  SELECT id, name, email, password, created_at, updated_at
  FROM users
  WHERE id = LAST_INSERT_ID();
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_users_get_by_email`(IN p_email VARCHAR(255))
BEGIN
  SELECT id, name, email, password, created_at, updated_at
  FROM users
  WHERE email = p_email
  LIMIT 1;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_users_get_by_id`(IN p_id INT)
BEGIN
  SELECT id, name, email, password, created_at, updated_at
  FROM users
  WHERE id = p_id
  LIMIT 1;
END$$
DELIMITER ;

