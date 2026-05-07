import express from "express";
import { getCommentsByPost, createComment, updateCommentById, deleteCommentById } from "../controllers/comments.controller.js";

const router = express.Router({ mergeParams: true });

router.get("/",     getCommentsByPost);
router.post("/",    createComment);
router.put("/:id",  updateCommentById);
router.delete("/:id", deleteCommentById);

export default router;
