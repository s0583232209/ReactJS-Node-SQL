import * as tasksRepo from "../repositories/tasks.repository.js";

export const getAll    = (userId)       => tasksRepo.getAll(userId);
export const getById   = (id)           => tasksRepo.getById(id);
export const addTask   = (details)      => tasksRepo.addTask(details);
export const updateTask = (id, details,userId) => tasksRepo.updateTask(id, details,userId);
export const deleteTask = (id,userId)          => tasksRepo.deleteTask(id,userId);
