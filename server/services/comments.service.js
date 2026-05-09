import * as commentsRepo from "../repositories/comments.repository.js";
import log from "../utils/logger.js";

export const getAllByPostId = (postId) => commentsRepo.getAllByPostId(postId);
export const getById = (id) => commentsRepo.getById(id);
export const addComment = (details, userId) =>
  commentsRepo.addComment(details, userId);
export const updateComment = (id, details, userId) => {
  log.info(`commentsService.updateComment - id: ${id}, userId: ${userId}`);
  return commentsRepo.updateComment(id, details, userId);
};
export const deleteComment = (id, userId) => {
  log.info(`commentsService.deleteComment - id: ${id}, userId: ${userId}`);
  return commentsRepo.deleteComment(id, userId);
};
