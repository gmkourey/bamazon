DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
    item_id INTEGER(10) AUTO_INCREMENT NOT NULL,
    product_name VARCHAR(30) NOT NULL,
    department_name VARCHAR(30) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    product_sales DECIMAL(10,2) DEFAULT 0 NOT NULL,
    stock_quantity INTEGER(10) NOT NULL,
    PRIMARY KEY (item_id)
);

USE bamazon_db;

CREATE TABLE departments (
    department_id INTEGER(10) AUTO_INCREMENT PRIMARY KEY NOT NULL,
    department_name VARCHAR(30) NOT NULL,
    over_head_costs INTEGER(10) NOT NULL
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Computer Mouse", "Electronics", 10, 20),
("Television", "Electronics", 400, 10),
("Razors", "Personal Care", 12.50, 50),
("Ice Cream", "Groceries", 6, 75),
("Chocolate Cake Mix", "Groceries", 5, 150),
("Green Tea", "Groceries", 5.99, 25),
("Batteries", "Household Items", 4.50, 60),
("Clorox Wipes", "Household Items", 7.99, 80),
("Toothpaste", "Personal Care", 3.99, 110),
("Shaving Cream", "Personal Care", 6.99, 130);
SELECT * FROM products;

INSERT INTO departments (department_name, over_head_costs)
VALUES ("Electronics", 3000), 
("Personal Care", 2500), 
("Groceries", 2250), 
("Household Items", 2500); 