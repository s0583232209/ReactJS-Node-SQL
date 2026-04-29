import { getConnection } from "./OnlyConnectionInTheMeantime.js";
export async function getById(id) {
  const connection = await getConnection();
  const [rows] = await connection.query("SELECT * FROM users WHERE id= ?;", [id]);
  return rows[0] || null;
}
export async function getAll() {
  const connection = await getConnection();
  const [rows] = await connection.query("SELECT * FROM users;");
  return rows;
}
