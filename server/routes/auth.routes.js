import express from "express";
import { BL_refreshToken } from "../controllers/auth.controller.js";

const router = express.Router();
console.log("in refresh router");
router.post("/refresh", BL_refreshToken);
export default router;
