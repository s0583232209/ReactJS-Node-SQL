import express from "express";
import {
  BL_getAllTasks,
  BL_createTask,
  BL_updateTask,
  BL_deleteTask,
} from "../controllers/tasks.controller.js";

const router = express.Router();

router.get("/", BL_getAllTasks);
router.post("/", BL_createTask);
router.put("/:id", BL_updateTask);
router.delete("/:id", BL_deleteTask);

export default router;
