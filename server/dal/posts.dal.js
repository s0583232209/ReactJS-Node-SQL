import { getConnection } from "./OnlyConnectionInTheMeantime.js";

export async function getAll(userId) {
  const connection = await getConnection();
  if (userId) {
    const [rows] = await connection.query("SELECT * FROM posts WHERE user_id = ?;", [userId]);
    return rows;
  }
  const [rows] = await connection.query("SELECT * FROM posts;");
  return rows;
}

export async function getById(id) {
  const connection = await getConnection();
  const [rows] = await connection.query("SELECT * FROM posts WHERE id = ?;", [id]);
  return rows[0] || null;
}

export async function addNewPost(details) {
  const connection = await getConnection();
  const [result] = await connection.query(
    "INSERT INTO posts (user_id, title, body) VALUES (?, ?, ?);",
    [details.user_id, details.title, details.body]
  );
  return { id: result.insertId, ...details };
}

export async function updatePost(id, details) {
  const connection = await getConnection();
  await connection.query(
    "UPDATE posts SET title = ?, body = ? WHERE id = ?;",
    [details.title, details.body, id]
  );
  return getById(id);
}

export async function deletePost(id) {
  const connection = await getConnection();
  const [result] = await connection.query("DELETE FROM posts WHERE id = ?;", [id]);
  return result.affectedRows > 0;
}
