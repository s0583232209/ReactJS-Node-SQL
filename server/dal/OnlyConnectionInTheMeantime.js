import { configDotenv } from "dotenv";

// export async function connect() {
//   // create connection object
//   const connection = await mysql.createConnection({
//     // host: process.env.HOST,
//     // user: process.env.USER,
//     // password: process.env.PASSWORD,
//     // database: process.env.DATABASE,
//     host: "localhost",
//     user: "root",
//     password: "Sarah2005!",
//     database: "project-part-7",
//   });

//   // connect
//   const connected = await connection.connect();
//   console.log(connected);

//   if (!connected)
//     console.log("not connected "); //change it so the logger will take care of it
//   else console.log("conected to database");
// }
import mysql from "mysql2/promise";
configDotenv();
export async function connect() {
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
    throw err;
  }
}
