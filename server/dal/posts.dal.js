import { getConnection } from "./OnlyConnectionInTheMeantime.js";
import log from "../utils/logger.js";

export async function DAL_getAll(userId) {
  try {
    log.info(`DAL_getAll called with userId: ${userId || 'all'}`);
    const connection = await getConnection();
    if (userId) {
      const [rows] = await connection.query("SELECT * FROM posts WHERE user_id = ?;", [userId]);
      log.info(`DAL_getAll successful, returned ${rows.length} posts for userId: ${userId}`);
      return rows;
    }
    const [rows] = await connection.query("SELECT * FROM posts;");
    log.info(`DAL_getAll successful, returned ${rows.length} posts`);
    return rows;
  } catch (err) {
    log.error(`DAL_getAll error: ${err.message}`);
    throw err;
  }
}

export async function DAL_getById(id) {
  try {
    log.info(`DAL_getById called with id: ${id}`);
    const connection = await getConnection();
    const [rows] = await connection.query("SELECT * FROM posts WHERE id = ?;", [id]);
    if (!rows[0]) throw new Error("Post not found");
    log.info(`DAL_getById successful for id: ${id}`);
    return rows[0];
  } catch (err) {
    log.error(`DAL_getById error: ${err.message}`);
    throw err;
  }
}

export async function DAL_addNewPost(details) {
  try {
    log.info(`DAL_addNewPost called for user_id: ${details.user_id}`);
    const connection = await getConnection();
    const [result] = await connection.query(
      "INSERT INTO posts (user_id, title, body) VALUES (?, ?, ?);",
      [details.user_id, details.title, details.body]
    );
    log.info(`DAL_addNewPost successful, post id: ${result.insertId}`);
    return { id: result.insertId, ...details };
  } catch (err) {
    log.error(`DAL_addNewPost error: ${err.message}`);
    throw err;
  }
}

export async function DAL_updatePost(id, details) {
  try {
    log.info(`DAL_updatePost called for id: ${id}`);
    const connection = await getConnection();
    await connection.query(
      "UPDATE posts SET title = ?, body = ? WHERE id = ?;",
      [details.title, details.body, id]
    );
    log.info(`DAL_updatePost successful for id: ${id}`);
    return DAL_getById(id);
  } catch (err) {
    log.error(`DAL_updatePost error: ${err.message}`);
    throw err;
  }
}

export async function DAL_deletePost(id) {
  try {
    log.info(`DAL_deletePost called for id: ${id}`);
    const connection = await getConnection();
    const [result] = await connection.query("DELETE FROM posts WHERE id = ?;", [id]);
    const deleted = result.affectedRows > 0;
    log.info(`DAL_deletePost ${deleted ? 'successful' : 'failed'} for id: ${id}`);
    return deleted;
  } catch (err) {
    log.error(`DAL_deletePost error: ${err.message}`);
    throw err;
  }
}
