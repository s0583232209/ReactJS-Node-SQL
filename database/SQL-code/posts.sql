CREATE TABLE posts (
    -- The unique ID of the post
    id INT PRIMARY KEY,
    
    -- Links to the ID in the users table
    user_id INT NOT NULL,
    
    -- Title of the post
    title VARCHAR(255),
    
    -- Content of the post
    body TEXT,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- 1. Insert from your provided JSON
INSERT INTO posts (id, user_id, title, body)
VALUES (1, 1, 'sunt aut facere repellat provident occaecati excepturi optio reprehenderit', 'quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto');

-- 2. Additional Example Post
INSERT INTO posts (id, user_id, title, body)
VALUES (2, 1, 'qui est esse', 'est rerum tempore vitae\nsequi sint nihil reprehenderit dolor beatae ea dolores neque\nfugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis\nqui aperiam non debitis possimus qui neque nisi nulla');

-- 3. Additional Example Post for a different user
INSERT INTO posts (id, user_id, title, body)
VALUES (3, 2, 'ea molestias quasi exercitationem repellat qui ipsa sit aut', 'et iusto sed quo iure\nvoluptatem occaecati omnis eligendi aut ad\nvoluptatem doloribus vel accusantium quis pariatur\nmolestiae porro eius odio et labore et velit aut');