import {
  DAL_getAll,
  DAL_addNewTask,
  DAL_updateTask,
  DAL_deleteTask,
} from "../dal/tasks.dal.js";
import log from "../utils/logger.js";
import { sendServerError } from "./response.helpers.js";
import { makeDeleteHandler, makeUpdateHandler, makeCreateHandler } from "./crud.helpers.js";

export async function BL_getAllTasks(req, res) {
  try {
    log.info("BL_getAllTasks called");
    console.log(req.user)
    const tasks = await DAL_getAll(req.user.userId);
    log.info(`BL_getAllTasks successful, returned ${tasks.length} tasks`);
    res.status(200).json(tasks);
  } catch (err) {
    log.error(`BL_getAllTasks error: ${err.message}`);
    sendServerError(res, "Failed to fetch tasks", err);
  }
}

export const BL_createTask = makeCreateHandler(
  (req) => DAL_addNewTask({ userId: req.body.userId, title: req.body.title, completed: req.body.completed }),
  "Task",
  (body) => (!body.userId || !body.title) ? "userId and title are required" : null,
);

export const BL_updateTask = makeUpdateHandler(
  DAL_updateTask,
  "Task",
  ({ title, completed }) => ({ title, completed }),
);

export const BL_deleteTask = makeDeleteHandler(DAL_deleteTask, "Task");
