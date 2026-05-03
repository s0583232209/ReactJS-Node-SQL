import log from "../utils/logger.js";
import {
  DAL_getAll,
  DAL_getById,
  DAL_addNewUser,
  DAL_getHashedPasswordById,
  DAL_getUserIdByUserName,
} from "../dal/users.dal.js";
import bcrypt from "bcrypt";

export async function BL_getById(req, res) {
  try {
    log.info(`BL_getById called for user id: ${req.params.id}`);
    const user = await DAL_getById(req.params.id);
    if (!user) throw new Error("user does not exist");
    log.info(`BL_getById successful, got user from database`);
    res.status(200).send(user);
  } catch (err) {
    log.warn(`BL_getById error: ${err.message}`);
    res.status(404).send("user does not exist in database");
  }
}

export async function BL_signup(req, res) {
  try {
    log.info(`BL_signup called for username: ${req.body.username}`);
    const body = req.body;
    body.password = await bcrypt.hash(body.password, 12);
    const user = await DAL_addNewUser(body);
    user.password = undefined;
    if (!user) throw new Error("could not add the user");
    log.info(`BL_signup successful for username: ${req.body.username}`);
    res.status(200).send(user);
  } catch (err) {
    log.warn(`BL_signup error: ${err.message}`);
    res.status(404).send("could not add the user");
  }
}

export async function BL_login(req, res) {
  try {
    log.info(`BL_login called for username: ${req.body.username}`);
    const userId = await DAL_getUserIdByUserName(req.body.username);
    if (!userId) throw new Error("user not found");
    const hashedPassword = await DAL_getHashedPasswordById(userId);
    const isMatch = await bcrypt.compare(req.body.password, hashedPassword);
    if (!isMatch) throw new Error("incorrect password");
    log.info(`BL_login successful for username: ${req.body.username}`);
    res.status(200).send("you are in");
  } catch (err) {
    log.warn(`BL_login error: ${err.message}`);
    res.status(404).send("this user does not exist");
  }
}
