import * as postsService from "../services/posts.service.js";
import log from "../utils/logger.js";
import { sendServerError } from "../utils/response.js";
import { makeDeleteHandler, makeUpdateHandler, makeCreateHandler } from "./crud.helpers.js";

export async function getAllPosts(req, res) {
  try {
    log.info("getAllPosts called");
    const posts = await postsService.getAll();
    log.info(`getAllPosts successful, returned ${posts.length} posts`);
    res.status(200).json(posts);
  } catch (err) {
    log.error(`getAllPosts error: ${err.message}`);
    sendServerError(res, "Failed to fetch posts", err);
  }
}

export const createPost = makeCreateHandler(
  (req) => postsService.addPost({ user_id: req.params.userId, title: req.body.title, body: req.body.body }),
  "Post",
  (body) => !body.title ? "title is required" : null,
);

export const updatePostById = makeUpdateHandler(
  postsService.updatePost,
  "Post",
  ({ title, body }) => ({ title, body }),
);

export const deletePostById = makeDeleteHandler(postsService.deletePost, "Post");
