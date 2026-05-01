import express from "express";
import {
  BL_getAllPosts,
  BL_createPost,
  BL_updatePostById,
  BL_deletePostById,
} from "../controllers/posts.controller.js";

const router = express.Router();

router.get("/", BL_getAllPosts);
router.post("/", BL_createPost);
router.put("/:id", BL_updatePostById);
router.delete("/:id", BL_deletePostById);

export default router;
