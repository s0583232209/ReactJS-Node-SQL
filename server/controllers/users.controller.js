import {
  getAll,
  getById,
  addNewUser,
  getHashedPasswordById,
  getUserIdByUserName,
} from "../dal/users.dal.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
const router = express.Router();

router.get("/:id", verifyToken, async (req, res) => {
  console.log("in users fetch");
  const user = await getById(req.params.id);
  console.log(user);
  if (user) res.status(200).send(user);
  else res.status(404).send("user does not exist in database");
});
router.post("/signup", async (req, res) => {
  const body = req.body;
  const plaintextPassword = req.body.password;
  body.password = await bcrypt.hash(body.password, 12);
  const user = await addNewUser(body);
  user.password = undefined;
  if (user) res.status(200).send(user);
  else res.status(404).send("could not add the user");
});

router.post("/login", async (req, res) => {
  console.log(req.body.username);
  const userId = await getUserIdByUserName(req.body.username);
  console.log(userId, "userId");
  const hashedPassword = await getHashedPasswordById(userId);
  console.log(hashedPassword, "hashed password");
  console.log(req.body.password);
  const isMatch = await bcrypt.compare(req.body.password, hashedPassword);
  console.log(isMatch);
  if (isMatch) {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.status(200).json({ token });
  } else res.status(404).send("this user does not exist");
});
export default router;
