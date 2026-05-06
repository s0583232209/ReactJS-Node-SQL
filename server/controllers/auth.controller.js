import jwt from "jsonwebtoken";
import { DAL_refreshToken } from "../dal/auth.dal.js";
import { tokenHandler, handleResponse } from "./auth.helpers.js";
export async function BL_refreshToken(req, res) {
  const token = req.cookies.refresh_token;
  if (!token)
    return res.status(401).send("No refresh token provided, log in again");
  try {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.log(`verifyToken error: ${err.message}`);
        return res.status(403).send("Failed to authenticate");
      }
      req.user = decoded;
      console.log(`verifyToken successful for user: ${decoded.email}`);
      const token = jwt.sign(user, process.env.JWT_SECRET, {
        expiresIn: "15m",
      });
      const dataBaseResponse=await DAL_refreshToken(decoded.userId);
      res.cookies("access_token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 60 * 1000 * 15,
      });
      res.status(200).send("token refreshed");
    });
  } catch (err) {
    if (err.name === "TokenExpiredError")
      return res.status(401).send("Session timeout");
    console.log(`verifyToken error: ${err.message}`);
    return res.status(403).send("Failed to authenticate");
  }
}
