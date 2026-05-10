import { getConnection } from "../db/connection.js";
import { makeGetById, makeDelete, makeUpdate } from "./repository.helpers.js";
import log from "../utils/logger.js";

export const getById = makeGetById("posts", "Post");
export const deletePost = makeDelete("posts");
export const updatePost = makeUpdate("posts", ["title", "body"], getById);

export async function getAll() {
  try {
    log.info("getAll posts called");
    const connection = await getConnection();
    const [rows] = await connection.execute("SELECT * FROM posts;");
    log.info(`getAll posts successful, returned ${rows.length} posts`);
    return rows;
  } catch (err) {
    log.error(`getAll posts error: ${err.message}`);
    throw err;
  }
}

export async function addPost(details) {
  try {
    log.info(`addPost called for user_id: ${details.user_id}`);
    const connection = await getConnection();
    const [result] = await connection.execute(
      "INSERT INTO posts (user_id, title, body) VALUES (?, ?, ?);",
      [details.user_id, details.title, details.body],
    );
    log.info(`addPost successful, post id: ${result.insertId}`);
    return { id: result.insertId, ...details };
  } catch (err) {
    log.error(`addPost error: ${err.message}`);
    throw err;
  }
}
