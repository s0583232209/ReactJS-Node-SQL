import jwt from "jsonwebtoken";

export async function tokenHandler(user, access) {
  const secretKey = access ? process.env.JWT_SECRET : process.env.JWT_SECRET;
  const token = jwt.sign(user, secretKey, { expiresIn: access ? "15m" : "7d" });
  return token;
}

export async function handleResponse(res, body, status, token, refreshToken) {
  res.cookie("access_token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 60 * 1000 * 5,
  });
  if (refreshToken)
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 60 * 1000 * 60 * 24 * 7,
    });
  res.status(status).send(body);
}
