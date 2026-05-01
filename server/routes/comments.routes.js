import express from "express";
import {
  BL_getCommentsByPost,
  BL_createComment,
  BL_updateCommentById,
  BL_deleteCommentById,
} from "../controllers/comments.controller.js";

const router = express.Router();

router.get("/", BL_getCommentsByPost);
router.post("/", BL_createComment);
router.put("/:id", BL_updateCommentById);
router.delete("/:id", BL_deleteCommentById);

export default router;
