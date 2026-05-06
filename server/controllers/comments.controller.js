import {
  DAL_getAllByPostId,
  DAL_addNewComment,
  DAL_updateComment,
  DAL_deleteComment,
} from "../dal/comments.dal.js";
import log from "../utils/logger.js";

export async function BL_getCommentsByPost(req, res) {
  try {
    log.info(`BL_getCommentsByPost called for postId: ${req.query.postId}`);
    const { postId } = req.query;
    if (!postId) {
      log.warn("BL_getCommentsByPost missing postId");
      return res
        .status(400)
        .json({ message: "postId query param is required" });
    }
    const comments = await DAL_getAllByPostId(postId);
    log.info(
      `BL_getCommentsByPost successful, returned ${comments.length} comments`,
    );
    res.status(200).json(comments);
  } catch (err) {
    log.error(`BL_getCommentsByPost error: ${err.message}`);
    res
      .status(500)
      .json({ message: "Failed to fetch comments", error: err.message });
  }
}

export async function BL_createComment(req, res) {
  try {
    console.log(req.body);
    log.info(`BL_createComment called for post_id: ${req.body.postId}`);

    const { postId, name, email, body } = req.body;
    if (!postId || !body) {
      log.warn("BL_createComment missing required fields");
      return res.status(400).json({ message: "post_id and body are required" });
    }
    console.log(req.user.userId)
    const newComment = await DAL_addNewComment(
      { postId, name, email, body },
      req.user.userId
    );
    log.info(`BL_createComment successful, comment id: ${newComment.id}`);
    res.status(201).json(newComment);
  } catch (err) {
    log.error(`BL_createComment error: ${err.message}`);
    res
      .status(500)
      .json({ message: "Failed to create comment", error: err.message });
  }
}

export async function BL_updateCommentById(req, res) {
  try {
    log.info(`BL_updateCommentById called for comment id: ${req.params.id}`);
    const { id } = req.params;
    const { name, body } = req.body;
    const updated = await DAL_updateComment(id, { name, body });
    if (!updated) {
      log.warn(`BL_updateCommentById comment not found: ${id}`);
      return res.status(404).json({ message: "Comment not found" });
    }
    log.info(`BL_updateCommentById successful for comment id: ${id}`);
    res.status(200).json(updated);
  } catch (err) {
    log.error(`BL_updateCommentById error: ${err.message}`);
    res
      .status(500)
      .json({ message: "Failed to update comment", error: err.message });
  }
}

export async function BL_deleteCommentById(req, res) {
  try {
    log.info(`BL_deleteCommentById called for comment id: ${req.params.id}`);
    const { id } = req.params;
    const deleted = await DAL_deleteComment(id);
    if (!deleted) {
      log.warn(`BL_deleteCommentById comment not found: ${id}`);
      return res.status(404).json({ message: "Comment not found" });
    }
    log.info(`BL_deleteCommentById successful for comment id: ${id}`);
    res.status(200).json({ message: `Comment ${id} deleted successfully` });
  } catch (err) {
    log.error(`BL_deleteCommentById error: ${err.message}`);
    res
      .status(500)
      .json({ message: "Failed to delete comment", error: err.message });
  }
}
