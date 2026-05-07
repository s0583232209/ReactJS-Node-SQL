import { getConnection } from "./db.connection.js";
import { makeGetById, makeDelete, makeUpdate } from "./dal.helpers.js";
import log from "../utils/logger.js";

export const DAL_getById = makeGetById("comments", "Comment");
export const DAL_deleteComment = makeDelete("comments");
export const DAL_updateComment = makeUpdate("comments", ["name", "body"], DAL_getById);

export async function DAL_getAllByPostId(postId) {
  try {
    log.info(`DAL_getAllByPostId called with postId: ${postId}`);
    const connection = await getConnection();
    const [rows] = await connection.execute(
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

export async function DAL_addNewComment(details, userId) {
  try {
    console.log(details, userId);
    log.info(`DAL_addNewComment called for post_id: ${details.postId}`);
    const connection = await getConnection();
    const [result] = await connection.execute(
      "INSERT INTO comments (post_id, user_id, body) VALUES (?, ?, ?);",
      [details.postId, userId, details.body],
    );
    log.info(`DAL_addNewComment successful, comment id: ${result.insertId}`);
    console.log({ ...details });
    return { id: result.insertId, ...details, userId: userId };
  } catch (err) {
    log.error(`DAL_addNewComment error: ${err.message}`);
    throw err;
  }
}
