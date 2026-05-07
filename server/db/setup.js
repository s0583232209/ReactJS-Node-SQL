import fs from "fs/promises";
import { getConnection } from "./connection.js";

export async function buildDataBase() {
  const connection = await getConnection();
  try {
    const schemaSQL          = await fs.readFile("./database/SQL-code/schema.sql", "utf8");
    const usersTableSQL      = await fs.readFile("./database/SQL-code/create-database-code/users.sql", "utf8");
    const passwordTableSQL   = await fs.readFile("./database/SQL-code/create-database-code/passwords.sql", "utf8");
    const postsTableSQL      = await fs.readFile("./database/SQL-code/create-database-code/posts.sql", "utf8");
    const tasksTableSQL      = await fs.readFile("./database/SQL-code/create-database-code/tasks.sql", "utf8");
    const commentsTableSQL   = await fs.readFile("./database/SQL-code/create-database-code/comments.sql", "utf8");
    const tokensTableSQL     = await fs.readFile("./database/SQL-code/create-database-code/tokens.sql", "utf8");

    const status = await connection.query(schemaSQL);
    if (!status) throw new Error("could not create the schema");
    await connection.query(`USE ${process.env.DATABASE}`);

    await createTable(usersTableSQL);
    await createTable(passwordTableSQL);
    await createTable(postsTableSQL);
    await createTable(tasksTableSQL);
    await createTable(commentsTableSQL);
    await createTable(tokensTableSQL);
    await seeds();
  } catch (err) {
    console.log(err);
  }
}

async function createTable(SQL) {
  const connection = await getConnection(false);
  return connection.query(SQL);
}

async function seeds() {
  const connection = await getConnection(false);
  try {
    const [users, passwords, posts, tasks, comments] = await Promise.all([
      fs.readFile("./database/SQL-code/seeds/seedUsers.sql", "utf8"),
      fs.readFile("./database/SQL-code/seeds/seedPassword.sql", "utf8"),
      fs.readFile("./database/SQL-code/seeds/seedPosts.sql", "utf8"),
      fs.readFile("./database/SQL-code/seeds/seedTasks.sql", "utf8"),
      fs.readFile("./database/SQL-code/seeds/seedComments.sql", "utf8"),
    ]);
    await connection.query(users);
    await connection.query(passwords);
    await connection.query(posts);
    await connection.query(tasks);
    await connection.query(comments);
    console.log("Database seeded successfully");
  } catch (err) {
    console.error("Error seeding database:", err);
    throw err;
  }
}
