import jwt from "jsonwebtoken";
import * as authService from "../services/auth.service.js";
import log from "../utils/logger.js";

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
  const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
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
