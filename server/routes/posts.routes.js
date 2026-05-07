import express from "express";
import { getAllPosts, createPost, updatePostById, deletePostById } from "../controllers/posts.controller.js";

const router = express.Router({ mergeParams: true });

router.get("/",     getAllPosts);
router.post("/",    createPost);
router.put("/:id",  updatePostById);
router.delete("/:id", deletePostById);

export default router;
