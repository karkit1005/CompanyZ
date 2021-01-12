CREATE DATABASE CompanyZ;

USE CompanyZ;

CREATE TABLE customers
(
	id INT PRIMARY KEY IDENTITY(1, 1),
	name VARCHAR(100) NOT NULL,
	dob DATETIME NULL,
	address VARCHAR(100) NULL,
	gender CHAR(1) NOT NULL,
	contact VARCHAR(30) NULL,
	source SMALLINT NOT NULL,
	updateDate DATETIME NOT NULL,
	deleted BIT DEFAULT 0
)

INSERT INTO customers (name, dob, address, gender, contact, source, updateDate) 
OUTPUT Inserted.id  
VALUES
('LUI KAR KIT', '1990-11-15', '371 Beach Road, #08-04 Singapore 199597', 1, '82898417', 1, GETDATE())

CREATE TABLE sources
(
	id INT PRIMARY KEY,
	source VARCHAR(50)
)

INSERT INTO sources VALUES 
(1, 'Instagram'),
(2, 'Facebook'),
(3, 'Tiktok'),
(4, 'Email'),
(5, 'TV'),
(6, 'Others')

CREATE TABLE genders
(
	id INT PRIMARY KEY,
	gender CHAR(10)
)

INSERT INTO genders VALUES
(1, 'Male'),
(2, 'Female')