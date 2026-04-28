CREATE TABLE users (
    -- Unique ID for each user, automatically increments
    id INT AUTO_INCREMENT PRIMARY KEY,
    
    -- Username must be unique and not empty
    username VARCHAR(50) NOT NULL UNIQUE,
    
    -- Email for recovery/contact
    email VARCHAR(100) NOT NULL UNIQUE,
       phone VARCHAR(10),
    name VARCHAR(50),
    -- Track when the account was created
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    zipcode INT,
 
    street VARCHAR(30),
    city VARCHAR(30),
    house_number INT
 
);
INSERT INTO users (username, email, phone, name, zipcode, street, city, house_number)
VALUES (
    'jdoe88', 
    'john.doe@example.com', 
    '0501234567', 
    'John Doe', 
    90210, 
    'Main Street', 
    'Jerusalem', 
    15
);
INSERT INTO users (username,email,phone,name,zipcode,street,city,house_number)
VALUES('first','first@first.com','1234567890','first',123456,'first','first',1);
SELECT * FROM users;
DROP TABLE users;