import jwt from "jsonwebtoken";
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
    if (err.name === "TokenExpiredError")
      return res.status(401).send("Session timeout");
    console.log(`verifyToken error: ${err.message}`);
    return res.status(403).send("Failed to authenticate");
  }
}
