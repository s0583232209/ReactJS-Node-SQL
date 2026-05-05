import {
  DAL_getAll,
  DAL_getById,
  DAL_addNewTask,
  DAL_updateTask,
  DAL_deleteTask,
} from "../dal/tasks.dal.js";
import log from "../utils/logger.js";

export async function BL_getAllTasks(req, res) {
  try {
    log.info("BL_getAllTasks called");
    const tasks = await DAL_getAll();
    log.info(`BL_getAllTasks successful, returned ${tasks.length} tasks`);
    res.status(200).json(tasks);
  } catch (err) {
    log.error(`BL_getAllTasks error: ${err.message}`);
    res
      .status(500)
      .json({ message: "Failed to fetch tasks", error: err.message });
  }
}

export async function BL_createTask(req, res) {
  try {
    log.info(`BL_createTask called for userId: ${req.body.userId}`);
    const { userId, title, completed } = req.body;
    if (!userId || !title) {
      log.warn("BL_createTask missing required fields");
      return res.status(400).json({ message: "userId and title are required" });
    }
    const newTask = await DAL_addNewTask({ userId, title, completed });
    log.info(`BL_createTask successful, task id: ${newTask.id}`);
    res.status(201).json(newTask);
  } catch (err) {
    log.error(`BL_createTask error: ${err.message}`);
    res
      .status(500)
      .json({ message: "Failed to create task", error: err.message });
  }
}

export async function BL_updateTask(req, res) {
  try {
    log.info(`BL_updateTask called for task id: ${req.params.id}`);
    const { id } = req.params;
    const { title, completed } = req.body;
    const updated = await DAL_updateTask(id, { title, completed });
    if (!updated) {
      log.warn(`BL_updateTask task not found: ${id}`);
      return res.status(404).json({ message: "Task not found" });
    }
    log.info(`BL_updateTask successful for task id: ${id}`);
    res.status(200).json(updated);
  } catch (err) {
    log.error(`BL_updateTask error: ${err.message}`);
    res
      .status(500)
      .json({ message: "Failed to update task", error: err.message });
  }
}

export async function BL_deleteTask(req, res) {
  try {
    log.info(`BL_deleteTask called for task id: ${req.params.id}`);
    const { id } = req.params;
    const deleted = await DAL_deleteTask(id);
    if (!deleted) {
      log.warn(`BL_deleteTask task not found: ${id}`);
      return res.status(404).json({ message: "Task not found" });
    }
    log.info(`BL_deleteTask successful for task id: ${id}`);
    res.status(200).json({ message: `Task ${id} deleted successfully` });
  } catch (err) {
    log.error(`BL_deleteTask error: ${err.message}`);
    res
      .status(500)
      .json({ message: "Failed to delete task", error: err.message });
  }
}
