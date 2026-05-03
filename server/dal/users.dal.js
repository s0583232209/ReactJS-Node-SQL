import { getConnection } from "./OnlyConnectionInTheMeantime.js";
import { configDotenv } from "dotenv";
import bcrypt from "bcrypt";
import log from "../utils/logger.js";
configDotenv();

export async function DAL_getById(id) {
  try {
    log.info(`DAL_getById called with id: ${id}`);
    const connection = await getConnection();
    const [rows] = await connection.query("SELECT * FROM users WHERE id= ?;", [
      id,
    ]);
    if (!rows[0]) throw new Error("User not found");
    log.info(`DAL_getById successful for id: ${id}`);
    return rows[0];
  } catch (err) {
    log.error(`DAL_getById error: ${err.message}`);
    throw err;
  }
}

export async function DAL_getAll() {
  try {
    log.info("DAL_getAll called");
    const connection = await getConnection();
    const [rows] = await connection.query("SELECT * FROM users;");
    log.info(`DAL_getAll successful, returned ${rows.length} users`);
    return rows;
  } catch (err) {
    log.error(`DAL_getAll error: ${err.message}`);
    throw err;
  }
}

export async function DAL_getUserIdByField(field,value) {
  try {
    log.info(`DAL_getUserIdByUserName called with  ${field}: ${value}`);
    const connection = await getConnection();
    const [rows] = await connection.query(
      `SELECT id FROM users WHERE ?=?`,
      [field,value],
    );
    if (!rows[0]) throw new Error("User not found");
    log.info(`DAL_getUserIdByUserName successful for ${field}: ${value}`);
    return rows[0].id;
  } catch (err) {
    log.error(`DAL_getUserIdByUserName error: ${err.message}`);
    throw err;
  }
}//this doesnt make so much sense, for it can be many rows

export async function DAL_addNewUser(details) {
  try {
    log.info(`DAL_addNewUser called for username: ${details.username}`);
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
    log.info(`DAL_addNewUser successful, user id: ${result.insertId}`);
    return { id: result.insertId, ...details };
  } catch (err) {
    log.error(`DAL_addNewUser error: ${err.message}`);
    throw err;
  }
}

export async function DAL_checkUsersDetails(user) {}
export async function DAL_loginDetails(email) {
  const connection = await getConnection();
  const [rows] = await connection.query(
    "SELECT passwords.hashed_password AS password FROM users JOIN passwords ON users.id=passwords.user_id WHERE email=?;",
    [email],
  );
  return rows[0].password;
}
