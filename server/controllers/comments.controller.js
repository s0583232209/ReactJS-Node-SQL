import { getAllByPostId, addNewComment, updateComment, deleteComment } from "../dal/comments.dal.js";

export async function getCommentsByPost(req, res) {
  try {
    const { postId } = req.query;
    if (!postId) {
      return res.status(400).json({ message: "postId query param is required" });
    }
    const comments = await getAllByPostId(postId);
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch comments", error: err.message });
  }
}

export async function createComment(req, res) {
  try {
    const { post_id, name, email, body } = req.body;
    if (!post_id || !body) {
      return res.status(400).json({ message: "post_id and body are required" });
    }
    const newComment = await addNewComment({ post_id, name, email, body });
    res.status(201).json(newComment);
  } catch (err) {
    res.status(500).json({ message: "Failed to create comment", error: err.message });
  }
}

export async function updateCommentById(req, res) {
  try {
    const { id } = req.params;
    const { name, body } = req.body;
    const updated = await updateComment(id, { name, body });
    if (!updated) return res.status(404).json({ message: "Comment not found" });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update comment", error: err.message });
  }
}

export async function deleteCommentById(req, res) {
  try {
    const { id } = req.params;
    const deleted = await deleteComment(id);
    if (!deleted) return res.status(404).json({ message: "Comment not found" });
    res.status(200).json({ message: `Comment ${id} deleted successfully` });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete comment", error: err.message });
  }
}
