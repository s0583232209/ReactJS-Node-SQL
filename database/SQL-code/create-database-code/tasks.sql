CREATE TABLE tasks (
	userId INT NOT NULL,
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR (200) NOT NULL,
    completed BOOLEAN NOT NULL
);
INSERT INTO tasks (userId,title,completed)VALUES(1,'first',false);
SELECT * FROM tasks;