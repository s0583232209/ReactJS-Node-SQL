import fs from "fs/promises";
import { getConnection } from "./db.connection.js";
import log from "../utils/logger.js";

const DATABASE_NAME = process.env.DATABASE;

export async function buildDataBase() {
  const connection = await getConnection();

  let schemaCreated = false;

  try {
    log.info("Starting database build...");


    const schemaSQL = await fs.readFile(
      "./database/SQL-code/schema.sql",
      "utf8",
    );

    await connection.query(schemaSQL);

    schemaCreated = true;

    log.info(`Database '${DATABASE_NAME}' created successfully`);

    await connection.query(`USE \`${DATABASE_NAME}\``);


    await createTable(
      connection,
      "./database/SQL-code/create-database-code/users.sql",
      "users",
    );

    await createTable(
      connection,
      "./database/SQL-code/create-database-code/passwords.sql",
      "passwords",
    );

    await createTable(
      connection,
      "./database/SQL-code/create-database-code/posts.sql",
      "posts",
    );

    await createTable(
      connection,
      "./database/SQL-code/create-database-code/tasks.sql",
      "tasks",
    );

    await createTable(
      connection,
      "./database/SQL-code/create-database-code/comments.sql",
      "comments",
    );

    await createTable(
      connection,
      "./database/SQL-code/create-database-code/tokens.sql",
      "tokens",
    );

    log.info("All tables created successfully");
    try {
      await seeds(connection);

      log.info("Database seeded successfully");
    } catch (seedError) {
      log.warn(
        `Database created successfully, but seeding failed: ${seedError.message}`,
      );

      console.warn(
        "WARNING: Database was created, but seed data failed.",
      );

      console.error(seedError);
    }

    log.info("Database build completed successfully");
  } catch (err) {
    log.error(`Database build failed: ${err.message}`);

    console.error("\nDATABASE SETUP FAILED");
    console.error(`Reason: ${err.message}\n`);


    if (schemaCreated) {
      try {
        log.warn("Removing partially created database...");

        await connection.query(
          `DROP DATABASE IF EXISTS \`${DATABASE_NAME}\`;`,
        );

        log.info("Partial database cleanup completed");
      } catch (cleanupError) {
        log.error(
          `Failed to cleanup partial database: ${cleanupError.message}`,
        );

        console.error(
          "CRITICAL: Failed to remove partially created database.",
        );

        console.error(cleanupError);
      }
    }

    throw err;
  }
}

async function createTable(connection, filePath, tableName) {
  try {
    const sql = await fs.readFile(filePath, "utf8");

    await connection.query(sql);

    log.info(`Table '${tableName}' created`);
  } catch (err) {
    throw new Error(
      `Failed to create table '${tableName}': ${err.message}`,
    );
  }
}

async function seeds(connection) {
  const seedFiles = [
    {
      path: "./database/SQL-code/seeds/seedUsers.sql",
      name: "users",
    },
    {
      path: "./database/SQL-code/seeds/seedPassword.sql",
      name: "passwords",
    },
    {
      path: "./database/SQL-code/seeds/seedPosts.sql",
      name: "posts",
    },
    {
      path: "./database/SQL-code/seeds/seedTasks.sql",
      name: "tasks",
    },
    {
      path: "./database/SQL-code/seeds/seedComments.sql",
      name: "comments",
    },
  ];

  for (const seed of seedFiles) {
    try {
      const sql = await fs.readFile(seed.path, "utf8");

      await connection.query(sql);

      log.info(`Seeded '${seed.name}'`);
    } catch (err) {
      throw new Error(
        `Failed seeding '${seed.name}': ${err.message}`,
      );
    }
  }
}