import * as tasksService from "../services/tasks.service.js";
import log from "../utils/logger.js";
import { sendServerError } from "../utils/response.js";
import { makeDeleteHandler, makeUpdateHandler, makeCreateHandler } from "./crud.helpers.js";

export async function getAllTasks(req, res) {
  try {
    log.info("getAllTasks called");
    const tasks = await tasksService.getAll(req.user.userId);
    log.info(`getAllTasks successful, returned ${tasks.length} tasks`);
    res.status(200).json(tasks);
  } catch (err) {
    log.error(`getAllTasks error: ${err.message}`);
    sendServerError(res, "Failed to fetch tasks", err);
  }
}

export const createTask = makeCreateHandler(
  (req) => tasksService.addTask({ userId: req.body.userId, title: req.body.title, completed: req.body.completed }),
  "Task",
  (body) => (!body.userId || !body.title) ? "userId and title are required" : null,
);

export const updateTask = makeUpdateHandler(
  tasksService.updateTask,
  "Task",
  ({ title, completed }) => ({ title, completed }),
);

export const deleteTask = makeDeleteHandler(tasksService.deleteTask, "Task");
