DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
item_id INT NOT NULL AUTO_INCREMENT,
product_name VARCHAR(150) NULL,
department_name VARCHAR(150) NULL,
price DECIMAL(10,2) NULL,
stock_quantity INT NULL DEFAULT 0,
PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('LEGOS', 'Toys', 9.99, 25),
('Monopoly Board Game', 'Toys', 12.99, 5),
('Macbook Pro', 'Electronics', 2999.99, 100),
('Microwave', 'Appliances', 359.99, 65),
('Amazon Alexa', 'Electronics', 99.99, 50),
('Earrings', 'Jewelry', 69.99, 25),
('Underwear', 'Clothing', 8.99, 100),
('Nerf Gun', 'Toys', 10.99, 13),
('Makeup', 'Cosmetics', 59.99, 25),
('Toaster', 'Appliances', 39.99, 10);
