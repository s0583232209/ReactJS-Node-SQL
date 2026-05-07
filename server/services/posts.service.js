import * as postsRepo from "../repositories/posts.repository.js";

export const getAll    = ()            => postsRepo.getAll();
export const getById   = (id)          => postsRepo.getById(id);
export const addPost   = (details)     => postsRepo.addPost(details);
export const updatePost = (id, details) => postsRepo.updatePost(id, details);
export const deletePost = (id)          => postsRepo.deletePost(id);
