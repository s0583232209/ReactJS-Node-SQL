import { getConnection } from "./OnlyConnectionInTheMeantime.js";
import log from "../utils/logger.js";

export async function DAL_getAllByPostId(postId) {
  try {
    log.info(`DAL_getAllByPostId called with postId: ${postId}`);
    const connection = await getConnection();
    const [rows] = await connection.query(
      "SELECT id,post_id AS postId, user_id AS userId,name, body FROM comments WHERE post_id = ?;",
      [postId],
    );
    log.info(`DAL_getAllByPostId successful, returned ${rows.length} comments`);
    return rows;
  } catch (err) {
    log.error(`DAL_getAllByPostId error: ${err.message}`);
    throw err;
  }
}

export async function DAL_getById(id) {
  try {
    log.info(`DAL_getById called with id: ${id}`);
    const connection = await getConnection();
    const [rows] = await connection.query(
      "SELECT * FROM comments WHERE id = ?;",
      [id],
    );
    if (!rows[0]) throw new Error("Comment not found");
    log.info(`DAL_getById successful for id: ${id}`);
    return rows[0];
  } catch (err) {
    log.error(`DAL_getById error: ${err.message}`);
    throw err;
  }
}

export async function DAL_addNewComment(details, userId) {
  try {
    console.log(details, userId);
    log.info(`DAL_addNewComment called for post_id: ${details.postId}`);
    const connection = await getConnection();
    const [result] = await connection.query(
      "INSERT INTO comments (post_id, user_id, body) VALUES (?, ?, ?);",
      [details.postId, userId, details.body],
    );
    log.info(`DAL_addNewComment successful, comment id: ${result.insertId}`);
    console.log({ ...details });
    return { id: result.insertId, ...details,userId:userId };
  } catch (err) {
    log.error(`DAL_addNewComment error: ${err.message}`);
    throw err;
  }
}

export async function DAL_updateComment(id, details) {
  try {
    log.info(`DAL_updateComment called for id: ${id}`);
    const connection = await getConnection();
    await connection.query(
      "UPDATE comments SET name = ?, body = ? WHERE id = ?;",
      [details.name, details.body, id],
    );
    log.info(`DAL_updateComment successful for id: ${id}`);
    return DAL_getById(id);
  } catch (err) {
    log.error(`DAL_updateComment error: ${err.message}`);
    throw err;
  }
}

export async function DAL_deleteComment(id) {
  try {
    log.info(`DAL_deleteComment called for id: ${id}`);
    const connection = await getConnection();
    const [result] = await connection.query(
      "DELETE FROM comments WHERE id = ?;",
      [id],
    );
    const deleted = result.affectedRows > 0;
    log.info(
      `DAL_deleteComment ${deleted ? "successful" : "failed"} for id: ${id}`,
    );
    return deleted;
  } catch (err) {
    log.error(`DAL_deleteComment error: ${err.message}`);
    throw err;
  }
}
