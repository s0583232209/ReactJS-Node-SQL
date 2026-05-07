import { configDotenv } from "dotenv";
import mysql from "mysql2/promise";
import { buildDataBase } from "./db.setup.js";

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
      });

      console.log("Connected to MySQL");
      try {
        await connection.query(`USE ${process.env.DATABASE}`);
      } catch (e) {
        connectionPromise = connection;
        buildDataBase();
      }
      return connection;
    } catch (err) {
      console.error("Connection failed:", err);
      connectionPromise = null;
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
