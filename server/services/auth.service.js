import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { getLoginDetails, addUser } from "../repositories/users.repository.js";

export function createAccessToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "15m" });
}

export function createRefreshToken(payload) {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
}

export function sendAuthResponse(res, body, status, accessToken, refreshToken) {
  res.cookie("access_token", accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 60 * 1000 * 15,
  });
  if (refreshToken) {
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 60 * 1000 * 60 * 24 * 7,
    });
  }
  res.status(status).json(body);
}

export async function login(email, password) {
  const row = await getLoginDetails(email);
  if (!row) throw new Error("User not found");
  const isMatch = await bcrypt.compare(password, row.hashedPassword);
  if (!isMatch) throw new Error("Incorrect password");
  const payload = { email, userId: row.userId };
  return {
    user: { email, userId: row.userId, msg: "success" },
    accessToken:  createAccessToken(payload),
    refreshToken: createRefreshToken(payload),
  };
}

export async function signup(body) {
  const hashedPassword = await bcrypt.hash(body.password, 12);
  const user = await addUser({ ...body, password: hashedPassword });
  delete user.password;
  const payload = { email: user.email, userId: user.id };
  return {
    user,
    accessToken:  createAccessToken(payload),
    refreshToken: createRefreshToken(payload),
  };
}
