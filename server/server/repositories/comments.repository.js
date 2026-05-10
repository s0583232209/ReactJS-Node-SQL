import { getConnection } from "../db/connection.js";
import { makeGetById, makeDelete, makeUpdate } from "./repository.helpers.js";
import log from "../utils/logger.js";

export const getById        = makeGetById("comments", "Comment");
export const deleteComment   = makeDelete("comments");
export const updateComment   = makeUpdate("comments", ["name", "body"], getById);

export async function getAllByPostId(postId) {
  try {
    log.info(`getAllByPostId called with postId: ${postId}`);
    const connection = await getConnection();
    const [rows] = await connection.execute(
      "SELECT id, post_id AS postId, user_id AS userId, name, body FROM comments WHERE post_id = ?;",
      [postId],
    );
    log.info(`getAllByPostId successful, returned ${rows.length} comments`);
    return rows;
  } catch (err) {
    log.error(`getAllByPostId error: ${err.message}`);
    throw err;
  }
}

export async function addComment(details, userId) {
  try {
    log.info(`addComment called for post_id: ${details.postId}`);
    const connection = await getConnection();
    const [result] = await connection.execute(
      "INSERT INTO comments (post_id, user_id, body) VALUES (?, ?, ?);",
      [details.postId, userId, details.body],
    );
    log.info(`addComment successful, comment id: ${result.insertId}`);
    return { id: result.insertId, ...details, userId };
  } catch (err) {
    log.error(`addComment error: ${err.message}`);
    throw err;
  }
}
