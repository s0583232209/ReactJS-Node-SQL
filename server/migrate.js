import { getConnection, connect } from "./dal/db.connection.js";
import { configDotenv } from "dotenv";
configDotenv();

await connect();
const connection = await getConnection();

console.log("Running migration: passwords table restructure...");

await connection.execute(`ALTER TABLE passwords DROP FOREIGN KEY passwords_ibfk_1`);
await connection.execute(`ALTER TABLE passwords DROP PRIMARY KEY`);
await connection.execute(`ALTER TABLE passwords ADD COLUMN id INT AUTO_INCREMENT PRIMARY KEY FIRST`);
await connection.execute(`ALTER TABLE passwords ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT TRUE`);
await connection.execute(`ALTER TABLE passwords ADD CONSTRAINT passwords_ibfk_1 FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE`);

console.log("Migration complete.");
process.exit(0);
