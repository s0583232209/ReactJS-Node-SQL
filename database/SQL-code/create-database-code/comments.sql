CREATE TABLE comments (
    -- 'id' is the primary key for the comment itself
    id INT PRIMARY KEY,
    
    -- 'postId' links this comment to a specific post
    post_id INT NOT NULL,
    
    -- Name or Subject of the comment
    name VARCHAR(255),
    
    -- Email of the commenter
    email VARCHAR(100),
    
    -- The actual content of the comment
    body TEXT,
    
    -- Optional: Track when the comment was saved
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO comments (id, post_id, name, email, body)
VALUES (
    1, 
    1, 
    'id labore ex et quam laborum', 
    'Eliseo@gardner.biz', 
    'laudantium enim quasi est quidem magnam voluptate ipsam eos\ntempora quo necessitatibus\ndolor quam autem quasi\nreiciendis et nam sapiente accusantium'
);