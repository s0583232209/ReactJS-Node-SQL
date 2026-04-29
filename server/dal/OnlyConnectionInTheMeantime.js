// Remove the problematic createConnection function as it's redundant
// The connect() function already handles connection creation}
import { configDotenv } from "dotenv";
import mysql from "mysql2/promise";
import fs from "fs/promises";
import { loadavg } from "os";
configDotenv();

let connectionPromise = null;

export async function connect() {
  if (connectionPromise) {
    return connectionPromise;
  }

  connectionPromise = (async () => {
    try {
      const connection = await mysql.createConnection({
        host: process.env.HOST,
        user: process.env.USER,
        password: process.env.PASSWORD,
        // database: process.env.DATABASE,
      });

      console.log("Connected to MySQL");
      try {
        connection.query("USE project_part_7");
      } catch (e) {
        connectionPromise = connection;
        buildDataBase();
      }
      return connection;
    } catch (err) {
      console.error("Connection failed:", err);
      connectionPromise = null; // Reset on failure to allow retry
      throw err;
    }
  })();

  return connectionPromise;
}

export async function getConnection(createNow = false) {
  if (connectionPromise) {
    return connectionPromise;
  } else if (createNow) {
    return await connect();
  } else {
    return null;
  }
}
export async function buildDataBase() {
  const connection = await getConnection();
  try {
    const schemaSQL = await fs.readFile(
      "./database/SQL-code/schema.sql",
      "utf8",
    );
    const usersTableSQL = await fs.readFile(
      "./database/SQL-code/create-database-code/users.sql",
      "utf8",
    );
    const passwordTableSQL = await fs.readFile(
      "./database/SQL-code/create-database-code/password.sql",
      "utf8",
    );
    const postsTableSQL = await fs.readFile(
      "./database/SQL-code/create-database-code/posts.sql",
      "utf8",
    );
    const tasksTableSQL = await fs.readFile(
      "./database/SQL-code/create-database-code/tasks.sql",
      "utf8",
    );
    const commentsTableSQL = await fs.readFile(
      "./database/SQL-code/create-database-code/comments.sql",
      "utf8",
    );
    const status = await connection.query(schemaSQL);
    if (!status) throw new Error("could not create the schema");
    await connection.query("USE project_part_7;");
    createTable(usersTableSQL);
    createTable(passwordTableSQL);
    createTable(postsTableSQL);
    createTable(tasksTableSQL);
    createTable(commentsTableSQL);
    seeds();
  } catch (err) {
    console.log(err);
  }
}
async function createTable(SQL) {
  const connection = await getConnection(false);
  const status = await connection.query(SQL);
  return status;
}
async function seeds() {
  const connection = await getConnection(false);
  try {
    // Read all seed files from the seeds folder
    const usersSeedSQL = await fs.readFile(
      "./database/SQL-code/seeds/seedUsers.sql",
      "utf8",
    );
    const passwordSeedSQL = await fs.readFile(
      "./database/SQL-code/seeds/seedPassword.sql",
      "utf8",
    );
    const postsSeedSQL = await fs.readFile(
      "./database/SQL-code/seeds/seedPosts.sql",
      "utf8",
    );
    const tasksSeedSQL = await fs.readFile(
      "./database/SQL-code/seeds/seedTasks.sql",
      "utf8",
    );
    const commentsSeedSQL = await fs.readFile(
      "./database/SQL-code/seeds/seedComments.sql",
      "utf8",
    );

    // Execute seed SQL files in order (users first due to foreign key dependencies)
    await connection.query(usersSeedSQL);
    await connection.query(passwordSeedSQL);
    await connection.query(postsSeedSQL);
    await connection.query(tasksSeedSQL);
    await connection.query(commentsSeedSQL);

    console.log("Database seeded successfully");
  } catch (err) {
    console.error("Error seeding database:", err);
    throw err;
  }
}
