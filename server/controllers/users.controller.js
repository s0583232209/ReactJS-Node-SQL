import log from "../utils/logger.js";
import {
  DAL_getAll,
  DAL_getById,
  DAL_addNewUser,
  DAL_loginDetails,
  DAL_updateProfile,
  DAL_getPasswordByUserId,
  DAL_getAllPasswordsByUserId,
  DAL_updateUsername,
  DAL_updatePassword,
} from "../dal/users.dal.js";
import bcrypt from "bcrypt";
import { tokenHandler, handleResponse } from "./auth.helpers.js";

export async function BL_getById(req, res) {
  try {
    log.info(`BL_getById called for user id: ${req.params.id}`);
    const user = await DAL_getById(req.params.id);
    if (!user) throw new Error("user does not exist");
    log.info(`BL_getById successful, got user from database`);
    return res.status(200).send(user);
  } catch (err) {
    log.warn(`BL_getById error: ${err.message}`);
    res.status(404).send("user does not exist in database");
  }
}

export async function BL_signup(req, res) {
  try {
    log.info(`BL_signup called for email: ${req.body.email}`);
    const body = req.body;
    body.password = await bcrypt.hash(body.password, 12);
    const user = await DAL_addNewUser(body);
    user.password = undefined;
    if (!user) throw new Error("could not add the user");
    log.info(`BL_signup successful for email: ${req.body.email}`);
    await handleResponse(
      res,
      user,
      200,
      await tokenHandler(user, true),
      await tokenHandler(user, false),
    );
  } catch (err) {
    log.warn(`BL_signup error: ${err.message}`);
    res.status(404).send("could not add the user");
  }
}

export async function BL_updateProfile(req, res) {
  try {
    const { id } = req.params;
    log.info(`BL_updateProfile called for user id: ${id}`);
    await DAL_updateProfile(id, req.body);
    const user = await DAL_getById(id);
    user.password = undefined;
    log.info(`BL_updateProfile successful for user id: ${id}`);
    return res.status(200).json(user);
  } catch (err) {
    log.warn(`BL_updateProfile error: ${err.message}`);
    return res.status(500).json({ message: "Failed to update profile", error: err.message });
  }
}

export async function BL_updateCredentials(req, res) {
  try {
    const { id } = req.params;
    const { currentPassword, newUsername, newPassword } = req.body;
    log.info(`BL_updateCredentials called for user id: ${id}`);
    const { hashedPassword } = await DAL_getPasswordByUserId(id);
    const isMatch = await bcrypt.compare(currentPassword, hashedPassword);
    if (!isMatch) {
      log.warn(`BL_updateCredentials: incorrect password for user id: ${id}`);
      return res.status(400).json({ message: "Incorrect current password" });
    }
    if (newUsername) await DAL_updateUsername(id, newUsername);
    if (newPassword) {
      const allPasswords = await DAL_getAllPasswordsByUserId(id);
      const comparisons = await Promise.all(
        allPasswords.map(({ hashedPassword }) => bcrypt.compare(newPassword, hashedPassword))
      );
      const isReused = comparisons.some(match => match === true);
      if (isReused) {
        log.warn(`BL_updateCredentials: reused password attempt for user id: ${id}`);
        return res.status(400).json({ message: "New password cannot be a previously used password" });
      }
      const hashed = await bcrypt.hash(newPassword, 12);
      await DAL_updatePassword(id, hashed);
    }
    const user = await DAL_getById(id);
    user.password = undefined;
    log.info(`BL_updateCredentials successful for user id: ${id}`);
    return res.status(200).json(user);
  } catch (err) {
    log.warn(`BL_updateCredentials error: ${err.message}`);
    return res.status(500).json({ message: "Failed to update credentials", error: err.message });
  }
}

export async function BL_login(req, res) {
  try {
    console.log("in bl log in");
    const { hashedPassword, userId } = await DAL_loginDetails(req.body.email);
    const isMatch = await bcrypt.compare(req.body.password, hashedPassword);
    if (!isMatch) throw new Error("incorrect password");
    log.info(`BL_login successful for email: ${req.body.email}`);
    await handleResponse(
      res,
      { email: req.body.email, userId: userId, msg: "success" },
      200,
      await tokenHandler(
        {
          email: req.body.email,
          userId: userId,
          msg: "success",
        },
        true,
      ),
      await tokenHandler({ email: req.body.email, userId: userId }, false),
    );
  } catch (err) {
    log.warn(`BL_login error: ${err.message}`);
    res.status(404).send("this user does not exist");
  }
}
