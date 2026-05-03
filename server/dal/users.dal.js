import { getConnection } from "./OnlyConnectionInTheMeantime.js";
import { configDotenv } from "dotenv";
import bcrypt from "bcrypt";
import log from "../utils/logger.js";
configDotenv();

export async function DAL_getById(id) {
  try {
    log.info(`DAL_getById called with id: ${id}`);
    const connection = await getConnection();
    const [rows] = await connection.query("SELECT * FROM users WHERE id= ?;", [id]);
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

export async function DAL_getUserIdByUserName(username) {
  try {
    log.info(`DAL_getUserIdByUserName called with username: ${username}`);
    const connection = await getConnection();
    const [rows] = await connection.query(
      `SELECT id FROM users WHERE username=?`,
      [username],
    );
    if (!rows[0]) throw new Error("User not found");
    log.info(`DAL_getUserIdByUserName successful for username: ${username}`);
    return rows[0].id;
  } catch (err) {
    log.error(`DAL_getUserIdByUserName error: ${err.message}`);
    throw err;
  }
}

export async function DAL_getHashedPasswordById(id) {
  try {
    log.info(`DAL_getHashedPasswordById called with id: ${id}`);
    const connection = await getConnection();
    const [result] = await connection.query(
      "SELECT hashed_password FROM passwords WHERE user_id=?;",
      [id],
    );
    if (!result[0]) throw new Error("Password not found");
    log.info(`DAL_getHashedPasswordById successful for id: ${id}`);
    return result[0].hashed_password;
  } catch (err) {
    log.error(`DAL_getHashedPasswordById error: ${err.message}`);
    throw err;
  }
}

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
