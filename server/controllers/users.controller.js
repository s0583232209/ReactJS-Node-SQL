import log from "../utils/logger.js";
import jwt from "jsonwebtoken";
import {
  DAL_getAll,
  DAL_getById,
  DAL_addNewUser,

  // DAL_getUserIdByUserName,
  DAL_loginDetails,
} from "../dal/users.dal.js";
import bcrypt from "bcrypt";

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
      await tokenHandler(user, false),
      await tokenHandler(user, true),
    );
  } catch (err) {
    log.warn(`BL_signup error: ${err.message}`);
    res.status(404).send("could not add the user");
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
        false,
      ),
      await tokenHandler({ email: req.body.email, userId: userId }, true),
    );
  } catch (err) {
    log.warn(`BL_login error: ${err.message}`);
    res.status(404).send("this user does not exist");
  }
}
async function tokenHandler(user, access) {
  const secretKey = access
    ? process.env.JWT_ACCESS_SECRET
    : process.env.JWT_REFRESH_SECRET;
  const token = jwt.sign(user, secretKey, { expiresIn: access ? "15m" : "7d" });

  return token;
}
async function handleResponse(res, body, status, token, refreshToken) {
  res.cookie("access_token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 60 * 1000,
  });
  if (refreshToken)
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 60 * 1000 * 60 * 24 * 7,
    });
  res.status(status).send(body);
}
