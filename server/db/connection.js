import { configDotenv } from "dotenv";
import mysql from "mysql2/promise";
import { buildDataBase } from "./setup.js";
import log from "../utils/logger.js";

configDotenv();

let connectionPromise = null;

export async function connect() {
  if (connectionPromise) return connectionPromise;

  connectionPromise = (async () => {
    try {
      const connection = await mysql.createConnection({
        host: process.env.HOST,
        user: process.env.USER,
        password: process.env.PASSWORD,
      });
      log.info(`Connected to MySQL at ${process.env.HOST}`);
      try {
        await connection.query(`USE ${process.env.DATABASE}`);
      } catch {
        connectionPromise = connection;
        buildDataBase();
      }
      return connection;
    } catch (err) {
      log.error(`Database connection failed: ${err.message}`);
      connectionPromise = null;
      throw err;
    }
  })();

  return connectionPromise;
}

export async function getConnection(createNow = false) {
  if (connectionPromise) return connectionPromise;
  if (createNow) return await connect();
  return null;
}
