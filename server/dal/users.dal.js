import { getConnection } from "./OnlyConnectionInTheMeantime.js";
export async function getById(id) {
  const connection = await getConnection();
  const [rows] = await connection.query("SELECT * FROM users WHERE id= ?;", [
    id,
  ]);
  return rows[0] || null;
}
export async function getAll() {
  const connection = await getConnection();
  const [rows] = await connection.query("SELECT * FROM users;");
  return rows;
}
export async function addNewUser(details) {
  const connection = await getConnection();
  const [result] = await connection.query(
    "INSERT INTO users (username,email,phone,name,zipcode,street,city,house_number)VALUES(?,?,?,?,?,?,?,?)",
    [
      details.username,
      details.email,
      details.phone,
      details.name,
      details.zipcode,
      details.street,
      details.city,
      details.house_number,
    ],
  );
  console.log({ id: result.insertId, ...details });
  return { id: result.insertId, ...details };
}
