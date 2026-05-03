import { getConnection } from "./OnlyConnectionInTheMeantime.js";
import { configDotenv } from "dotenv";
import bcrypt from "bcrypt";
configDotenv();
export async function DAL_getById(id) {
  const connection = await getConnection();
  const [rows] = await connection.query("SELECT * FROM users WHERE id= ?;", [
    id,
  ]);
  return rows[0] || null;
}
export async function DAL_getAll() {
  const connection = await getConnection();
  const [rows] = await connection.query("SELECT * FROM users;");
  return rows;
}
export async function DAL_getUserIdByUserName(username) {
  const connection = await getConnection();
  const [rows] = await connection.query(
    `SELECT id FROM users WHERE username=?`,
    [username],
  );
  return rows[0].id;
}
export async function DAL_getHashedPasswordById(id) {
  const connection = await getConnection();
  const [result] = await connection.query(
    "SELECT hashed_password FROM passwords WHERE user_id=?;",
    [id],
  );
  return result[0].hashed_password;
}
export async function DAL_addNewUser(details) {
  console.log("in add new user");
  const connection = await getConnection();
  connection.query(`USE ${process.env.DATABASE}`);
  const [result] = await connection.query(
    "INSERT INTO users (username,email,phone,name,zipcode,street,city,house_number)VALUES(?,?,?,?,?,?,?,?);",
    [
      details.username,
      details.email,
      details.phone,
      details.name,
      details.zipcode,
      details.street,
      details.city,
      details.house_number,
    ],
  );

  const passwordResult = await connection.query(
    "INSERT INTO passwords (user_id,hashed_password) VALUES (?,?);",
    [result.insertId, details.password],
  );
  console.log({ id: result.insertId, ...details });
  return { id: result.insertId, ...details };
}
export async function DAL_checkUsersDetails(user) {}
