CREATE TABLE passwords (
    -- Links to the main ID in your users table
      user_id INT  PRIMARY KEY,
    
    -- Stores the full hash string (Salt + Hash + Metadata)
    hashed_password VARCHAR(255) NOT NULL,
    
    -- Metadata for security audits
    last_password_change TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Reference the main users table (assuming it is named 'users')
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
