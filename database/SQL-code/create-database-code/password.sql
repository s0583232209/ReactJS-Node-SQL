CREATE TABLE passwords (
    -- Links to the main ID in your users table
    user_id INT PRIMARY KEY,
    
    -- Stores the full hash string (Salt + Hash + Metadata)
    hashed_password VARCHAR(255) NOT NULL,
    
    -- Metadata for security audits
    last_password_change TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Reference the main users table (assuming it is named 'users')
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
INSERT INTO passwords (user_id, hashed_password)
VALUES (1, '$2b$12$R9h/cIPz0gi.URQHueD1Vu9S6I7bi93GE76W596LS8L.L2yO.6m7i');