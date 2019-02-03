DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
item_id INT NOT NULL AUTO_INCREMENT,
product_name VARCHAR(150) NULL,
department_name VARCHAR(150) NULL,
price DECIMAL(10,2) NULL,
stock_quantity INT NULL DEFAULT 0,
product_sales DECIMAL(12,2) DEFAULT 0.00,
PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('LEGOS', 'Toys', 9.99, 2),
('Monopoly Board Game', 'Toys', 12.99, 999),
('Macbook Pro', 'Electronics', 2999.99, 500),
('Microwave', 'Appliances', 359.99, 160),
('Amazon Alexa', 'Electronics', 99.99, 15),
('Earrings', 'Jewelry', 69.99, 25),
('Underwear', 'Clothing', 8.99, 100),
('Nerf Gun', 'Toys', 10.99, 100),
('Makeup', 'Cosmetics', 59.99, 400),
('Toaster', 'Appliances', 39.99, 75);

CREATE TABLE departments(
department_id INT NOT NULL AUTO_INCREMENT,
department_name VARCHAR(150) NOT NULL,
over_head_costs DECIMAL(12,2) NULL,
PRIMARY KEY(department_id)
);

INSERT INTO departments (department_name, over_head_costs)
VALUES ('Toys', 5000),
('Electronics', 100000),
('Appliances', 2500),
('Jewelry', 800),
('Cosmetics', 10000),
('Clothing', 250);
