import { getConnection } from "./db.connection.js";
import { makeGetById, makeDelete, makeUpdate } from "./dal.helpers.js";
import log from "../utils/logger.js";

export const DAL_getById = makeGetById("posts", "Post");
export const DAL_deletePost = makeDelete("posts");
export const DAL_updatePost = makeUpdate("posts", ["title", "body"], DAL_getById);

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

export async function DAL_addNewPost(details) {
  try {
    log.info(`DAL_addNewPost called for user_id: ${details.userId}`);
    const connection = await getConnection();
    const [result] = await connection.execute(
      "INSERT INTO posts (user_id, title, body) VALUES (?, ?, ?);",
      [details.userId, details.title, details.body],
    );
    log.info(`DAL_addNewPost successful, post id: ${result.insertId}`);
    return { id: result.insertId, ...details };
  } catch (err) {
    log.error(`DAL_addNewPost error: ${err.message}`);
    throw err;
  }
}
