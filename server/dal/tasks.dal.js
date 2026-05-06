import { getConnection } from "./OnlyConnectionInTheMeantime.js";
import log from "../utils/logger.js";

export async function DAL_getById(id) {
  try {
    log.info(`DAL_getById called with id: ${id}`);
    const connection = await getConnection();
    const [rows] = await connection.execute("SELECT * FROM tasks WHERE id = ?;", [id]);
    if (!rows[0]) throw new Error("Task not found");
    log.info(`DAL_getById successful for id: ${id}`);
    return rows[0];
  } catch (err) {
    log.error(`DAL_getById error: ${err.message}`);
    throw err;
  }
}

export async function DAL_getAll(userId) {
  try {
    log.info("DAL_getAll called with userId"+userId);
    const connection = await getConnection();
    const [rows] = await connection.execute("SELECT * FROM tasks WHERE user_id=?;",[userId]);
    log.info(`DAL_getAll successful, returned ${rows.length} tasks`);
    return rows;
  } catch (err) {
    log.error(`DAL_getAll error: ${err.message}`);
    throw err;
  }
}

export async function DAL_addNewTask(details) {
  try {
    log.info(`DAL_addNewTask called for userId: ${details.userId}`);
    const connection = await getConnection();
    const [result] = await connection.execute(
      "INSERT INTO tasks (user_id, title, completed) VALUES (?, ?, ?);",
      [details.userId, details.title, details.completed ?? false]
    );
    log.info(`DAL_addNewTask successful, task id: ${result.insertId}`);
    return { id: result.insertId, ...details };
  } catch (err) {
    log.error(`DAL_addNewTask error: ${err.message}`);
    throw err;
  }
}

export async function DAL_updateTask(id, details) {
  try {
    log.info(`DAL_updateTask called for id: ${id}`);
    const connection = await getConnection();
    await connection.execute(
      "UPDATE tasks SET title = ?, completed = ? WHERE id = ?;",
      [details.title, details.completed, id]
    );
    log.info(`DAL_updateTask successful for id: ${id}`);
    return DAL_getById(id);
  } catch (err) {
    log.error(`DAL_updateTask error: ${err.message}`);
    throw err;
  }
}

export async function DAL_deleteTask(id) {
  try {
    log.info(`DAL_deleteTask called for id: ${id}`);
    const connection = await getConnection();
    const [result] = await connection.execute("DELETE FROM tasks WHERE id = ?;", [id]);
    const deleted = result.affectedRows > 0;
    log.info(`DAL_deleteTask ${deleted ? 'successful' : 'failed'} for id: ${id}`);
    return deleted;
  } catch (err) {
    log.error(`DAL_deleteTask error: ${err.message}`);
    throw err;
  }
}
