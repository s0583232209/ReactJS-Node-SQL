import { getConnection } from "./OnlyConnectionInTheMeantime.js";

export async function getById(id) {
  const connection = await getConnection();
  const [rows] = await connection.query("SELECT * FROM tasks WHERE id = ?;", [id]);
  return rows[0] || null;
}

export async function getAll() {
  const connection = await getConnection();
  const [rows] = await connection.query("SELECT * FROM tasks;");
  return rows;
}

export async function addNewTask(details) {
  const connection = await getConnection();
  const [result] = await connection.query(
    "INSERT INTO tasks (userId, title, completed) VALUES (?, ?, ?);",
    [details.userId, details.title, details.completed ?? false]
  );
  return { id: result.insertId, ...details };
}

export async function updateTask(id, details) {
  const connection = await getConnection();
  await connection.query(
    "UPDATE tasks SET title = ?, completed = ? WHERE id = ?;",
    [details.title, details.completed, id]
  );
  return getById(id);
}

export async function deleteTask(id) {
  const connection = await getConnection();
  const [result] = await connection.query("DELETE FROM tasks WHERE id = ?;", [id]);
  return result.affectedRows > 0;
}
