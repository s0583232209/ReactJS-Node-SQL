import {
  DAL_getAll,
  DAL_getById,
  DAL_addNewUser,
  DAL_getHashedPasswordById,
  DAL_getUserIdByUserName,
} from "../dal/users.dal.js";
import bcrypt from "bcrypt";

export async function BL_getById(req, res) {
  console.log("in users fetch");
  const user = await DAL_getById(req.params.id);
  console.log(user);
  if (user) res.status(200).send(user);
  else res.status(404).send("user does not exist in database");
}
export async function BL_signup(req, res) {
  const body = req.body;
  const plaintextPassword = req.body.password;
  body.password = await bcrypt.hash(body.password, 12);
  const user = await DAL_addNewUser(body);
  user.password = undefined;
  if (user) res.status(200).send(user);
  else res.status(404).send("could not add the user");
}
export async function BL_login(req, res) {
  console.log(req.body.username);
  const userId = await DAL_getUserIdByUserName(req.body.username);
  console.log(userId, "userId");
  const hashedPassword = await DAL_getHashedPasswordById(userId);
  console.log(hashedPassword, "hashed password");
  console.log(req.body.password);
  const isMatch = await bcrypt.compare(req.body.password, hashedPassword);
  console.log(isMatch);
  if (isMatch) res.status(200).send("you are in");
  else res.status(404).send("this user does not exist");
}
