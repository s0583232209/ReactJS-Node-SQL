import express from "express";
import { login, signup, refreshToken, logout } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/login",   login);
router.post("/signup",  signup);
router.post("/refresh", refreshToken);
router.post("/logout",  logout);

export default router;
