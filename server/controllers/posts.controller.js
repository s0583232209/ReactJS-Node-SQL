import {
  DAL_getAll,
  DAL_addNewPost,
  DAL_updatePost,
  DAL_deletePost,
} from "../dal/posts.dal.js";
import log from "../utils/logger.js";
import { sendServerError } from "./response.helpers.js";
import { makeDeleteHandler, makeUpdateHandler, makeCreateHandler } from "./crud.controller.js";

export async function BL_getAllPosts(req, res) {
  try {
    log.info(`BL_getAllPosts called `);
    const { userId } = req.query;
    const posts = await DAL_getAll();
    log.info(`BL_getAllPosts successful, returned ${posts.length} posts`);
    res.status(200).json(posts);
  } catch (err) {
    log.error(`BL_getAllPosts error: ${err.message}`);
    sendServerError(res, "Failed to fetch posts", err);
  }
}

export const BL_createPost = makeCreateHandler(
  (req) => DAL_addNewPost({ user_id: req.body.user_id, title: req.body.title, body: req.body.body }),
  "Post",
  (body) => (!body.user_id || !body.title) ? "user_id and title are required" : null,
);

export const BL_updatePostById = makeUpdateHandler(
  DAL_updatePost,
  "Post",
  ({ title, body }) => ({ title, body }),
);

export const BL_deletePostById = makeDeleteHandler(DAL_deletePost, "Post");
