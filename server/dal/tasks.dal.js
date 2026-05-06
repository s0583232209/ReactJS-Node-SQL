import { getConnection } from "./db.connection.js";
import { makeGetById, makeDelete, makeUpdate } from "./dal.helpers.js";
import log from "../utils/logger.js";

export const DAL_getById = makeGetById("tasks", "Task");
export const DAL_deleteTask = makeDelete("tasks");
export const DAL_updateTask = makeUpdate("tasks", ["title", "completed"], DAL_getById);

export async function DAL_getAll(userId) {
  try {
    log.info("DAL_getAll called with userId" + userId);
    const connection = await getConnection();
    const [rows] = await connection.execute(
      "SELECT * FROM tasks WHERE user_id=?;",
      [userId],
    );
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
      [details.userId, details.title, details.completed ?? false],
    );
    log.info(`DAL_addNewTask successful, task id: ${result.insertId}`);
    return { id: result.insertId, ...details };
  } catch (err) {
    log.error(`DAL_addNewTask error: ${err.message}`);
    throw err;
  }
}
