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
(1, 'Bret', 'Sincere@april.biz', '1770736803', 'Leanne Graham', 92998, 'Kulas Light', 'Gwenborough', 556),
(2, 'Antonette', 'Shanna@melissa.tv', '0106926593', 'Ervin Howell', 90566, 'Victor Plains', 'Wisokyburgh', 879),
(3, 'Samantha', 'Nathan@yesenia.net', '1463123444', 'Clementine Bauch', 59590, 'Douglas Extension', 'McKenziehaven', 847),
(4, 'Karianne', 'Julianne.OConner@kory.org', '4931709623', 'Patricia Lebsack', 53919, 'Hoeger Mall', 'South Elvis', 692),
(5, 'Kamren', 'Lucio_Hettinger@annie.ca', '2549541289', 'Chelsey Dietrich', 33263, 'Skiles Walks', 'Roscoeview', 351),
(6, 'Leopoldo_Corkery', 'Karley_Dach@jasper.info', '1477935847', 'Mrs. Dennis Schulist', 23505, 'Norberto Crossing', 'South Christy', 950),
(7, 'Elwyn.Skiles', 'Telly.Hoeger@billy.biz', '2100676132', 'Kurtis Weissnat', 58804, 'Rex Trail', 'Howemouth', 280),
(8, 'Maxime_Nienow', 'Sherwood@rosamond.me', '5864936943', 'Nicholas Runolfsdottir V', 45169, 'Ellsworth Summit', 'Aliyaview', 729),
(9, 'Delphine', 'Chaim_McDermott@dana.io', '7759766794', 'Glenna Reichert', 76495, 'Dayna Park', 'Bartholomebury', 449),
(10, 'Moriah.Stanton', 'Rey.Padberg@karina.biz', '0246483804', 'Clementina DuBuque', 31428, 'Kattie Turnpike', 'Lebsackbury', 198),