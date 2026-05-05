CREATE TABLE comments (
    -- 'id' is the primary key for the comment itself
      id INT AUTO_INCREMENT PRIMARY KEY,
    
    -- 'postId' links this comment to a specific post
    post_id INT NOT NULL,
    
    -- Name or Subject of the comment
    name VARCHAR(255),
    user_id INT,
    
    -- The actual content of the comment
    body TEXT,
    
    -- Optional: Track when the comment was saved
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
