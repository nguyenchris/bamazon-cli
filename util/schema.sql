DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
item_id INT NOT NULL AUTO_INCREMENT,
product_name VARCHAR(150) NULL,
department_name VARCHAR(150) NULL,
price DECIMAL(40,2) DEFAULT 0.00,
stock_quantity INT DEFAULT 0,
product_sales DECIMAL(40,2) DEFAULT 0.00,
PRIMARY KEY (item_id)
);

CREATE TABLE departments(
department_id INT NOT NULL AUTO_INCREMENT,
department_name VARCHAR(150) NOT NULL,
over_head_costs DECIMAL(40,2) DEFAULT 0.00,
PRIMARY KEY(department_id)
);

