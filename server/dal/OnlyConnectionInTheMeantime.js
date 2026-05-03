import { configDotenv } from "dotenv";
import mysql from "mysql2/promise";
import log from "../utils/logger.js";

configDotenv();

let connectionPromise = null;

export async function connect() {
  if (connectionPromise) {
    return connectionPromise;
  }

  connectionPromise = (async () => {
    const connection = await mysql.createConnection({
      host: process.env.HOST,
      user: process.env.USER,
      password: process.env.PASSWORD,
      database: process.env.DATABASE,
    });

    console.log("Connected to MySQL");
    return connection;
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
