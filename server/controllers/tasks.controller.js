import { getAll, getById, addNewTask, updateTask, deleteTask } from "../dal/tasks.dal.js";

export async function getAllTodos(req, res) {
  try {
    const todos = await getAll();
    res.status(200).json(todos);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch todos", error: err.message });
  }
}

export async function createTodo(req, res) {
  try {
    const { userId, title, completed } = req.body;
    if (!userId || !title) {
      return res.status(400).json({ message: "userId and title are required" });
    }
    const newTodo = await addNewTask({ userId, title, completed });
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(500).json({ message: "Failed to create todo", error: err.message });
  }
}

export async function updateTodo(req, res) {
  try {
    const { id } = req.params;
    const { title, completed } = req.body;
    const updated = await updateTask(id, { title, completed });
    if (!updated) return res.status(404).json({ message: "Todo not found" });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update todo", error: err.message });
  }
}

export async function deleteTodo(req, res) {
  try {
    const { id } = req.params;
    const deleted = await deleteTask(id);
    if (!deleted) return res.status(404).json({ message: "Todo not found" });
    res.status(200).json({ message: `Todo ${id} deleted successfully` });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete todo", error: err.message });
  }
}
