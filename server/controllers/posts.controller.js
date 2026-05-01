import {
  DAL_getAll,
  DAL_getById,
  DAL_addNewPost,
  DAL_updatePost,
  DAL_deletePost,
} from "../dal/posts.dal.js";

export async function BL_getAllPosts(req, res) {
  try {
    const { userId } = req.query;
    const posts = await DAL_getAll(userId);
    res.status(200).json(posts);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch posts", error: err.message });
  }
}

export async function BL_createPost(req, res) {
  try {
    const { user_id, title, body } = req.body;
    if (!user_id || !title) {
      return res
        .status(400)
        .json({ message: "user_id and title are required" });
    }
    const newPost = await DAL_addNewPost({ user_id, title, body });
    res.status(201).json(newPost);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to create post", error: err.message });
  }
}

export async function BL_updatePostById(req, res) {
  try {
    const { id } = req.params;
    const { title, body } = req.body;
    const updated = await DAL_updatePost(id, { title, body });
    if (!updated) return res.status(404).json({ message: "Post not found" });
    res.status(200).json(updated);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update post", error: err.message });
  }
}

export async function BL_deletePostById(req, res) {
  try {
    const { id } = req.params;
    const deleted = await DAL_deletePost(id);
    if (!deleted) return res.status(404).json({ message: "Post not found" });
    res.status(200).json({ message: `Post ${id} deleted successfully` });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete post", error: err.message });
  }
}
