import { getConnection } from "./OnlyConnectionInTheMeantime.js";

export async function DAL_getAllByPostId(postId) {
  const connection = await getConnection();
  const [rows] = await connection.query("SELECT * FROM comments WHERE post_id = ?;", [postId]);
  return rows;
}

export async function DAL_getById(id) {
  const connection = await getConnection();
  const [rows] = await connection.query("SELECT * FROM comments WHERE id = ?;", [id]);
  return rows[0] || null;
}

export async function DAL_addNewComment(details) {
  const connection = await getConnection();
  const [result] = await connection.query(
    "INSERT INTO comments (post_id, name, email, body) VALUES (?, ?, ?, ?);",
    [details.post_id, details.name, details.email, details.body]
  );
  return { id: result.insertId, ...details };
}

export async function DAL_updateComment(id, details) {
  const connection = await getConnection();
  await connection.query(
    "UPDATE comments SET name = ?, body = ? WHERE id = ?;",
    [details.name, details.body, id]
  );
  return getById(id);
}

export async function DAL_deleteComment(id) {
  const connection = await getConnection();
  const [result] = await connection.query("DELETE FROM comments WHERE id = ?;", [id]);
  return result.affectedRows > 0;
}
