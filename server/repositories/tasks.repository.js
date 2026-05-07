import { getConnection } from "../db/connection.js";
import { makeGetById, makeDelete, makeUpdate } from "./repository.helpers.js";
import log from "../utils/logger.js";

export const getById    = makeGetById("tasks", "Task");
export const deleteTask  = makeDelete("tasks");
export const updateTask  = makeUpdate("tasks", ["title", "completed"], getById);

export async function getAll(userId) {
  try {
    log.info(`getAll tasks called for userId: ${userId}`);
    const connection = await getConnection();
    const [rows] = await connection.execute("SELECT * FROM tasks WHERE user_id=?;", [userId]);
    log.info(`getAll tasks successful, returned ${rows.length} tasks`);
    return rows;
  } catch (err) {
    log.error(`getAll tasks error: ${err.message}`);
    throw err;
  }
}

export async function addTask(details) {
  try {
    log.info(`addTask called for userId: ${details.userId}`);
    const connection = await getConnection();
    const [result] = await connection.execute(
      "INSERT INTO tasks (user_id, title, completed) VALUES (?, ?, ?);",
      [details.userId, details.title, details.completed ?? false],
    );
    log.info(`addTask successful, task id: ${result.insertId}`);
    return { id: result.insertId, ...details };
  } catch (err) {
    log.error(`addTask error: ${err.message}`);
    throw err;
  }
}
