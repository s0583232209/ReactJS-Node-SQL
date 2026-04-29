// Remove the problematic createConnection function as it's redundant
// The connect() function already handles connection creation}
import { configDotenv } from "dotenv";
import mysql from "mysql2/promise";

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
        database: process.env.DATABASE,
      });

      console.log("Connected to MySQL");
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
