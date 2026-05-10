CREATE TABLE users (
    -- Unique ID for each user, automatically increments
    id INT AUTO_INCREMENT PRIMARY KEY,
    -- Username must be unique and not empty
    username VARCHAR(50) NOT NULL,
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
