import * as tasksRepo from "../repositories/tasks.repository.js";
import log from "../utils/logger.js";

export const getAll = (userId) => tasksRepo.getAll(userId);
export const getById = (id) => tasksRepo.getById(id);
export const addTask = (details) => tasksRepo.addTask(details);
export const updateTask = (id, details, userId) => {
  log.info(`tasksService.updateTask - id: ${id}, userId: ${userId}`);
  return tasksRepo.updateTask(id, details, userId);
};
export const deleteTask = (id, userId) => {
  log.info(`tasksService.deleteTask - id: ${id}, userId: ${userId}`);
  return tasksRepo.deleteTask(id, userId);
};
