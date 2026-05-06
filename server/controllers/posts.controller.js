import {
  DAL_getAll,
  DAL_getById,
  DAL_addNewPost,
  DAL_updatePost,
  DAL_deletePost,
} from "../dal/posts.dal.js";
import log from "../utils/logger.js";

export async function BL_getAllPosts(req, res) {
  try {
    log.info(`BL_getAllPosts called `);
    const { userId } = req.query;
    const posts = await DAL_getAll();
    log.info(`BL_getAllPosts successful, returned ${posts.length} posts`);
    res.status(200).json(posts);
  } catch (err) {
    log.error(`BL_getAllPosts error: ${err.message}`);
    res
      .status(500)
      .json({ message: "Failed to fetch posts", error: err.message });
  }
}

export async function BL_createPost(req, res) {
  try {
    log.info(`BL_createPost called for user_id: ${req.body.user_id}`);
    const { user_id, title, body } = req.body;
    if (!user_id || !title) {
      log.warn("BL_createPost missing required fields");
      return res
        .status(400)
        .json({ message: "user_id and title are required" });
    }
    const newPost = await DAL_addNewPost({ user_id, title, body });
    log.info(`BL_createPost successful, post id: ${newPost.id}`);
    res.status(201).json(newPost);
  } catch (err) {
    log.error(`BL_createPost error: ${err.message}`);
    res
      .status(500)
      .json({ message: "Failed to create post", error: err.message });
  }
}

export async function BL_updatePostById(req, res) {
  try {
    log.info(`BL_updatePostById called for post id: ${req.params.id}`);
    const { id } = req.params;
    const { title, body } = req.body;
    const updated = await DAL_updatePost(id, { title, body });
    if (!updated) {
      log.warn(`BL_updatePostById post not found: ${id}`);
      return res.status(404).json({ message: "Post not found" });
    }
    log.info(`BL_updatePostById successful for post id: ${id}`);
    res.status(200).json(updated);
  } catch (err) {
    log.error(`BL_updatePostById error: ${err.message}`);
    res
      .status(500)
      .json({ message: "Failed to update post", error: err.message });
  }
}

export async function BL_deletePostById(req, res) {
  try {
    log.info(`BL_deletePostById called for post id: ${req.params.id}`);
    const { id } = req.params;
    const deleted = await DAL_deletePost(id);
    if (!deleted) {
      log.warn(`BL_deletePostById post not found: ${id}`);
      return res.status(404).json({ message: "Post not found" });
    }
    log.info(`BL_deletePostById successful for post id: ${id}`);
    res.status(200).json({ message: `Post ${id} deleted successfully` });
  } catch (err) {
    log.error(`BL_deletePostById error: ${err.message}`);
    res
      .status(500)
      .json({ message: "Failed to delete post", error: err.message });
  }
}
