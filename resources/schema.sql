DROP TABLE IF EXISTS sales;


-- Create tables for raw data to be loaded into
CREATE TABLE sales (
id SERIAL PRIMARY KEY,
date date,
country VARCHAR,
city VARCHAR,
lat FLOAT,
lng FLOAT,
product_type VARCHAR,
product VARCHAR,
qty FLOAT,
price FLOAT,
price_wd FLOAT,
discount BOOLEAN,
revenue FLOAT,
month INTEGER,
week INTEGER,
YEAR INTEGER,
dow INTEGER


);
