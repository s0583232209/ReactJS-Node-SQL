import jwt from "jsonwebtoken";
import * as authService from "../services/auth.service.js"
import { DAL_refreshToken } from "../dal/auth.dal.js";
import { tokenHandler, handleResponse } from "./auth.helpers.js";
import log from "../utils/logger.js";
import bcrypt from "bcrypt";
export async function BL_refreshToken(req, res) {
  const token = req.cookies.refresh_token;
  if (!token)
    return res.status(401).send("No refresh token provided, log in again");
  try {
    console.log(req.user);
    const dataBaseResponse = await DAL_refreshToken(req.params.userId);
    if (dataBaseResponse.revoked) {
      log.warn(`refresh token revoked for user id: ${req.params.userId}`);
      return res.status(403).send("Refresh token revoked");
    }

    // Compare the hashed refresh token from database with the user's refresh token
    const isTokenValid = await bcrypt.compare(
      token,
      dataBaseResponse.refreshToken,
    );
    if (!isTokenValid) {
      return res.status(403).send("Invalid refresh token");
    }
    jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
      if (err) {
        log.error(`verifyToken error: ${err.message}`);
        return res.status(403).send("Failed to authenticate");
      }
      req.user = decoded;
    });
    log.info(`verifyToken successful for user: ${req.user.email}`);
    const token = jwt.sign(req.user, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });
    res.cookie("access_token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 60 * 1000 * 15,
    });
    res.status(200).send("token refreshed");
  } catch (err) {
    log.warn(`login error: ${err.message}`);
    res.status(401).json({ message: "Invalid email or password" });
  }
}

export async function signup(req, res) {
  try {
    const { user, accessToken, refreshToken } = await authService.signup(
      req.body,
    );
    log.info(`signup successful for email: ${req.body.email}`);
    authService.sendAuthResponse(res, user, 200, accessToken, refreshToken);
  } catch (err) {
    log.warn(`signup error: ${err.message}`);
    res.status(400).json({ message: err.message || "Could not create user" });
  }
}

export function refreshToken(req, res) {
  const token = req.cookies.refresh_token;
  if (!token)
    return res.status(401).json({ message: "No refresh token provided" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const accessToken = authService.createAccessToken({
      email: decoded.email,
      userId: decoded.userId,
    });
    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 60 * 1000 * 15,
    });
    res.status(200).json({ message: "Token refreshed" });
  } catch (err) {
    log.warn(`refreshToken error: ${err.message}`);
    const status = err.name === "TokenExpiredError" ? 401 : 403;
    res
      .status(status)
      .json({ message: "Session expired, please log in again" });
  }
}

export function logout(req, res) {
  res.clearCookie("access_token");
  res.clearCookie("refresh_token");
  res.status(200).json({ message: "Logged out" });
}
export async function login(req, res) {
  try {
    const { user, accessToken, refreshToken } = await authService.login(
      req.body.email,
      req.body.password,
    );
    log.info(`login successful for email: ${req.body.email}`);
    authService.sendAuthResponse(res, user, 200, accessToken, refreshToken);
  } catch (err) {
    log.warn(`login error: ${err.message}`);
    res.status(401).json({ message: "Invalid email or password" });
  }
}
