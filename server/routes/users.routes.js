import express from "express";
import {
  BL_login,
  BL_signup,
  BL_getById,
} from "../controllers/users.controller.js";
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "Users route working" });
});
router.post("/login", BL_login);
router.post("/signup", BL_signup);

router.get("/:id", BL_getById);
export default router;
