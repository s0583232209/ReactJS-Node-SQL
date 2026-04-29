CREATE TABLE posts (
    -- The unique ID of the post
      id INT AUTO_INCREMENT PRIMARY KEY,
    
    -- Links to the ID in the users table
    user_id INT NOT NULL,
    
    -- Title of the post
    title VARCHAR(255),
    
    -- Content of the post
    body TEXT,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
