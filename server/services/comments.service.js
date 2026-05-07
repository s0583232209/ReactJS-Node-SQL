import * as commentsRepo from "../repositories/comments.repository.js";

export const getAllByPostId  = (postId)          => commentsRepo.getAllByPostId(postId);
export const getById         = (id)              => commentsRepo.getById(id);
export const addComment      = (details, userId) => commentsRepo.addComment(details, userId);
export const updateComment   = (id, details)     => commentsRepo.updateComment(id, details);
export const deleteComment   = (id)              => commentsRepo.deleteComment(id);
