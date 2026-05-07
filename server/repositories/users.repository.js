import { getConnection } from "../db/connection.js";
import log from "../utils/logger.js";

export async function getById(id) {
  try {
    log.info(`getById users called with id: ${id}`);
    const connection = await getConnection();
    const [rows] = await connection.execute("SELECT * FROM users WHERE id = ?;", [id]);
    if (!rows[0]) throw new Error("User not found");
    log.info(`getById users successful for id: ${id}`);
    return rows[0];
  } catch (err) {
    log.error(`getById users error: ${err.message}`);
    throw err;
  }
}

export async function addUser(details) {
  try {
    log.info(`addUser called for username: ${details.username}`);
    const connection = await getConnection();
    const [result] = await connection.execute(
      "INSERT INTO users (username, email, phone, name, zipcode, street, city, house_number) VALUES (?,?,?,?,?,?,?,?);",
      [details.username, details.email, details.phone, details.name, details.zipcode, details.street, details.city, details.house_number],
    );
    await connection.execute(
      "INSERT INTO passwords (user_id, hashed_password, is_active) VALUES (?, ?, TRUE);",
      [result.insertId, details.password],
    );
    log.info(`addUser successful, user id: ${result.insertId}`);
    return { id: result.insertId, ...details };
  } catch (err) {
    log.error(`addUser error: ${err.message}`);
    throw err;
  }
}

export async function updateProfile(id, details) {
  try {
    const connection = await getConnection();
    const [result] = await connection.execute(
      `UPDATE users SET name=?, email=?, phone=?, street=?, city=?, zipcode=?, house_number=? WHERE id=?`,
      [details.name, details.email, details.phone, details.street, details.city, details.zipcode, details.house_number || null, id],
    );
    log.info(`updateProfile successful for id: ${id}`);
    return result.affectedRows > 0;
  } catch (err) {
    log.error(`updateProfile error: ${err.message}`);
    throw err;
  }
}

export async function getPasswordByUserId(userId) {
  try {
    const connection = await getConnection();
    const [rows] = await connection.execute(
      `SELECT hashed_password AS hashedPassword FROM passwords WHERE user_id=? AND is_active=TRUE`,
      [userId],
    );
    if (!rows[0]) throw new Error("Password not found");
    return rows[0];
  } catch (err) {
    log.error(`getPasswordByUserId error: ${err.message}`);
    throw err;
  }
}

export async function getAllPasswordsByUserId(userId) {
  try {
    const connection = await getConnection();
    const [rows] = await connection.execute(
      `SELECT hashed_password AS hashedPassword FROM passwords WHERE user_id=?`,
      [userId],
    );
    return rows;
  } catch (err) {
    log.error(`getAllPasswordsByUserId error: ${err.message}`);
    throw err;
  }
}

export async function updateUsername(id, username) {
  try {
    const connection = await getConnection();
    const [result] = await connection.execute(
      `UPDATE users SET username=? WHERE id=?`,
      [username, id],
    );
    return result.affectedRows > 0;
  } catch (err) {
    log.error(`updateUsername error: ${err.message}`);
    throw err;
  }
}

export async function updatePassword(userId, hashedPassword) {
  try {
    const connection = await getConnection();
    await connection.execute(`UPDATE passwords SET is_active=FALSE WHERE user_id=?`, [userId]);
    const [result] = await connection.execute(
      `INSERT INTO passwords (user_id, hashed_password, is_active) VALUES (?, ?, TRUE)`,
      [userId, hashedPassword],
    );
    return result.affectedRows > 0;
  } catch (err) {
    log.error(`updatePassword error: ${err.message}`);
    throw err;
  }
}

export async function getLoginDetails(email) {
  const connection = await getConnection();
  const [rows] = await connection.execute(
    `SELECT passwords.hashed_password AS hashedPassword, passwords.user_id AS userId
     FROM users JOIN passwords ON users.id = passwords.user_id
     WHERE email=? AND passwords.is_active=TRUE`,
    [email],
  );
  return rows[0];
}
