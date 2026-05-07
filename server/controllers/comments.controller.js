import {
  DAL_getAllByPostId,
  DAL_addNewComment,
  DAL_updateComment,
  DAL_deleteComment,
} from "../dal/comments.dal.js";
import log from "../utils/logger.js";
import { sendServerError, sendBadRequest } from "./response.helpers.js";
import { makeDeleteHandler, makeUpdateHandler, makeCreateHandler } from "./crud.helpers.js";

export async function BL_getCommentsByPost(req, res) {
  try {
    log.info(`BL_getCommentsByPost called for postId: ${req.query.postId}`);
    const { postId } = req.query;
    if (!postId) {
      log.warn("BL_getCommentsByPost missing postId");
      return sendBadRequest(res, "postId query param is required");
    }
    const comments = await DAL_getAllByPostId(postId);
    log.info(`BL_getCommentsByPost successful, returned ${comments.length} comments`);
    res.status(200).json(comments);
  } catch (err) {
    log.error(`BL_getCommentsByPost error: ${err.message}`);
    sendServerError(res, "Failed to fetch comments", err);
  }
}

export const BL_createComment = makeCreateHandler(
  (req) => {
    console.log(req.body);
    console.log(req.user.userId);
    const { postId, name, email, body } = req.body;
    return DAL_addNewComment({ postId, name, email, body }, req.user.userId);
  },
  "Comment",
  (body) => (!body.postId || !body.body) ? "post_id and body are required" : null,
);

export const BL_updateCommentById = makeUpdateHandler(
  DAL_updateComment,
  "Comment",
  ({ name, body }) => ({ name, body }),
);

export const BL_deleteCommentById = makeDeleteHandler(DAL_deleteComment, "Comment");
