import * as postsRepo from "../repositories/posts.repository.js";
import log from "../utils/logger.js";

export const getAll = () => postsRepo.getAll();
export const getById = (id) => postsRepo.getById(id);
export const addPost = (details) => postsRepo.addPost(details);
export const updatePost = (id, details, userId) => {
  log.info(`postsService.updatePost - id: ${id}, userId: ${userId}`);
  return postsRepo.updatePost(id, details, userId);
};
export const deletePost = (id, userId) => {
  log.info(`postsService.deletePost - id: ${id}, userId: ${userId}`);
  return postsRepo.deletePost(id, userId);
};
