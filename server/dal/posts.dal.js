import { getConnection } from "./OnlyConnectionInTheMeantime.js";
import log from "../utils/logger.js";

export async function DAL_getAll() {
  try {
    log.info(`DAL_getAll called `);
    const connection = await getConnection();

    const [rows] = await connection.execute("SELECT * FROM posts;");
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
    const [rows] = await connection.execute("SELECT * FROM posts WHERE id = ?;", [
      id,
    ]);
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
    const [result] = await connection.execute(
      "INSERT INTO posts (user_id, title, body) VALUES (?, ?, ?);",
      [details.user_id, details.title, details.body],
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
    await connection.execute(
      "UPDATE posts SET title = ?, body = ? WHERE id = ?;",
      [details.title, details.body, id],
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
    const [result] = await connection.execute("DELETE FROM posts WHERE id = ?;", [
      id,
    ]);
    const deleted = result.affectedRows > 0;
    log.info(
      `DAL_deletePost ${deleted ? "successful" : "failed"} for id: ${id}`,
    );
    return deleted;
  } catch (err) {
    log.error(`DAL_deletePost error: ${err.message}`);
    throw err;
  }
}
