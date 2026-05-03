import {
  DAL_getAll,
  DAL_getById,
  DAL_addNewTask,
  DAL_updateTask,
  DAL_deleteTask,
} from "../dal/tasks.dal.js";

export async function BL_getAllTasks(req, res) {
  try {
    const tasks = await DAL_getAll();
    res.status(200).json(tasks);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch tasks", error: err.message });
  }
}

export async function BL_createTask(req, res) {
  try {
    const { userId, title, completed } = req.body;
    if (!userId || !title) {
      return res.status(400).json({ message: "userId and title are required" });
    }
    const newTask = await DAL_addNewTask({ userId, title, completed });
    res.status(201).json(newTask);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to create task", error: err.message });
  }
}

export async function BL_updateTask(req, res) {
  try {
    const { id } = req.params;
    const { title, completed } = req.body;
    const updated = await DAL_updateTask(id, { title, completed });
    if (!updated) return res.status(404).json({ message: "Task not found" });
    res.status(200).json(updated);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update task", error: err.message });
  }
}

export async function BL_deleteTask(req, res) {
  try {
    const { id } = req.params;
    const deleted = await DAL_deleteTask(id);
    if (!deleted) return res.status(404).json({ message: "Task not found" });
    res.status(200).json({ message: `Task ${id} deleted successfully` });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete task", error: err.message });
  }
}
