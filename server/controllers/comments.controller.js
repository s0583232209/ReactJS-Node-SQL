import * as commentsService from "../services/comments.service.js";
import log from "../utils/logger.js";
import { sendServerError, sendBadRequest } from "../utils/response.js";
import { makeDeleteHandler, makeUpdateHandler, makeCreateHandler } from "./crud.helpers.js";

export async function getCommentsByPost(req, res) {
  try {
    log.info(`getCommentsByPost called for postId: ${req.query.postId}`);
    const { postId } = req.query;
    if (!postId) {
      log.warn("getCommentsByPost missing postId");
      return sendBadRequest(res, "postId query param is required");
    }
    const comments = await commentsService.getAllByPostId(postId);
    log.info(`getCommentsByPost successful, returned ${comments.length} comments`);
    res.status(200).json(comments);
  } catch (err) {
    log.error(`getCommentsByPost error: ${err.message}`);
    sendServerError(res, "Failed to fetch comments", err);
  }
}

export const createComment = makeCreateHandler(
  (req) => {
    const { postId, name, email, body } = req.body;
    return commentsService.addComment({ postId, name, email, body }, req.user.userId);
  },
  "Comment",
  (body) => (!body.postId || !body.body) ? "post_id and body are required" : null,
);

export const updateCommentById = makeUpdateHandler(
  commentsService.updateComment,
  "Comment",
  ({ name, body }) => ({ name, body }),
);

export const deleteCommentById = makeDeleteHandler(commentsService.deleteComment, "Comment");
