import { getAll, getById } from "../dal/users.dal.js";
import express from "express";
const router = express.Router();

router.get("/:id", async (req, res) => {
  console.log("in users fetch");
  const user = await getById(req.params.id);
  if (user) res.status(200).send(user);
  else res.status(404).send("user does not exist in database");
});
export default router;
