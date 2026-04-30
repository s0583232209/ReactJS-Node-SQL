import { getConnection } from "./OnlyConnectionInTheMeantime.js";
import { configDotenv } from "dotenv";
import bcrypt from "bcrypt";
configDotenv();
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
//VERY IMPORTANT - THIS DOES NOT TAKE CARE OF THE PASSWORD!!!!!!! AND THIS IS CRITICAL
export async function addNewUser(details) {
  console.log("in add new user");
  const connection = await getConnection();
  connection.query(`USE ${process.env.DATABASE}`);
  const [result] = await connection.query(
    "INSERT INTO users (username,email,phone,name,zipcode,street,city,house_number)VALUES(?,?,?,?,?,?,?,?);",
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
  const hashedPassword = await bcrypt.hash(details.password, 12);
  console.log("after hashing");
  console.log(hashedPassword, result.insertId);
  const passwordResult = await connection.query(
    "INSERT INTO passwords (user_id,hashed_password) VALUES (?,?);",
    [result.insertId, hashedPassword],
  );
  console.log({ id: result.insertId, ...details });
  return { id: result.insertId, ...details };
}

async function registerUser(plainPassword) {
  // This automatically generates a salt and merges it with the hash
  const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

  // Save 'hashedPassword' in your MySQL database
  return hashedPassword;
}
