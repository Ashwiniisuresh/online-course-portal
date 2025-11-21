DROP DATABASE IF EXISTS online_courses;
CREATE DATABASE online_courses CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE online_courses;

-- users
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- courses
CREATE TABLE courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- cart items
CREATE TABLE cart_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  course_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_cart_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_cart_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  UNIQUE KEY ux_user_course (user_id, course_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- orders
CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  stripe_session_id VARCHAR(255),
  amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  currency VARCHAR(10) NOT NULL DEFAULT 'usd',
  status ENUM('pending','paid','failed','cancelled') DEFAULT 'pending',
  paid_at TIMESTAMP NULL DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_order_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- order_courses (order line items)
CREATE TABLE order_courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  course_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  price_at_purchase DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_oc_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  CONSTRAINT fk_oc_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  UNIQUE KEY ux_order_course (order_id, course_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DELIMITER $$

DROP PROCEDURE IF EXISTS sp_users_get_by_email $$
CREATE PROCEDURE sp_users_get_by_email(IN p_email VARCHAR(255))
BEGIN
  SELECT id, name, email, password, created_at, updated_at
  FROM users
  WHERE email = p_email
  LIMIT 1;
END $$

DROP PROCEDURE IF EXISTS sp_users_get_by_id $$
CREATE PROCEDURE sp_users_get_by_id(IN p_id INT)
BEGIN
  SELECT id, name, email, password, created_at, updated_at
  FROM users
  WHERE id = p_id
  LIMIT 1;
END $$

DROP PROCEDURE IF EXISTS sp_users_create $$
CREATE PROCEDURE sp_users_create(
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
END $$

DROP PROCEDURE IF EXISTS sp_courses_list $$
CREATE PROCEDURE sp_courses_list()
BEGIN
  SELECT id, title, description, price, created_at, updated_at
  FROM courses
  ORDER BY created_at DESC;
END $$

DROP PROCEDURE IF EXISTS sp_courses_get_by_id $$
CREATE PROCEDURE sp_courses_get_by_id(IN p_id INT)
BEGIN
  SELECT id, title, description, price, created_at, updated_at
  FROM courses
  WHERE id = p_id
  LIMIT 1;
END $$

DROP PROCEDURE IF EXISTS sp_courses_seed_defaults $$
CREATE PROCEDURE sp_courses_seed_defaults()
BEGIN
  IF (SELECT COUNT(*) FROM courses) = 0 THEN
    INSERT INTO courses (title, description, price)
    VALUES
      ('Angular Basics', 'Learn Angular', 19.99),
      ('Node.js API', 'Backend APIs', 24.99),
      ('Fullstack Course', 'E2E Project', 39.99);
  END IF;
  SELECT COUNT(*) AS course_count FROM courses;
END $$

DROP PROCEDURE IF EXISTS sp_cart_get_by_user $$
CREATE PROCEDURE sp_cart_get_by_user(IN p_user_id INT)
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
END $$

DROP PROCEDURE IF EXISTS sp_cart_add_or_increment $$
CREATE PROCEDURE sp_cart_add_or_increment(
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
END $$

DROP PROCEDURE IF EXISTS sp_cart_remove_item $$
CREATE PROCEDURE sp_cart_remove_item(
  IN p_cart_item_id INT,
  IN p_user_id INT
)
BEGIN
  DELETE FROM cart_items
  WHERE id = p_cart_item_id AND user_id = p_user_id;

  SELECT ROW_COUNT() AS affected_rows;
END $$

DROP PROCEDURE IF EXISTS sp_cart_clear $$
CREATE PROCEDURE sp_cart_clear(IN p_user_id INT)
BEGIN
  DELETE FROM cart_items WHERE user_id = p_user_id;
  SELECT ROW_COUNT() AS affected_rows;
END $$

DROP PROCEDURE IF EXISTS sp_cart_remove_by_course $$
CREATE PROCEDURE sp_cart_remove_by_course(
  IN p_user_id INT,
  IN p_course_id INT
)
BEGIN
  DELETE FROM cart_items
  WHERE user_id = p_user_id AND course_id = p_course_id;
END $$

DROP PROCEDURE IF EXISTS sp_orders_create $$
CREATE PROCEDURE sp_orders_create(
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
END $$

DROP PROCEDURE IF EXISTS sp_order_items_insert $$
CREATE PROCEDURE sp_order_items_insert(
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
END $$

DROP PROCEDURE IF EXISTS sp_orders_get_with_items $$
CREATE PROCEDURE sp_orders_get_with_items(IN p_order_id INT)
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
END $$

DROP PROCEDURE IF EXISTS sp_orders_get_by_session $$
CREATE PROCEDURE sp_orders_get_by_session(
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
END $$

DROP PROCEDURE IF EXISTS sp_orders_get_paid $$
CREATE PROCEDURE sp_orders_get_paid(IN p_user_id INT)
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
END $$

DROP PROCEDURE IF EXISTS sp_orders_finalize $$
CREATE PROCEDURE sp_orders_finalize(
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
END $$

DELIMITER ;
