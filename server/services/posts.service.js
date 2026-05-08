import * as postsRepo from "../repositories/posts.repository.js";

export const getAll    = ()            => postsRepo.getAll();
export const getById   = (id)          => postsRepo.getById(id);
export const addPost   = (details)     => postsRepo.addPost(details);
export const updatePost = (id, details,userId) => postsRepo.updatePost(id, details,userId);
export const deletePost = (id,userId)          => postsRepo.deletePost(id,userId);
