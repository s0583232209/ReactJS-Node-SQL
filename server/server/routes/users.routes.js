import express from "express";
import { getById, updateProfile, updateCredentials } from "../controllers/users.controller.js";

const router = express.Router();

router.get("/:id",              getById);
router.put("/:id/profile",      updateProfile);
router.put("/:id/credentials",  updateCredentials);

export default router;
