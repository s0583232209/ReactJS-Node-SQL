import express from "express";
import { BL_refresh } from "../controllers/auth.controller.js";

const router = express.Router();
router.post("/refresh", BL_refresh);
export default router;
