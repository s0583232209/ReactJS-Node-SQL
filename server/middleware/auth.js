import jwt from "jsonwebtoken";
export default async function token(req, res, next) {
  if (req.url.endsWith("/signup") || req.url.endsWith("/login"))return next();
  console.log( "token middleware");
  const token = req.cookies.access_token;
  if (!token) return res.status(401).send("No token provided");
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).send("Failed to authenticate");
    req.user = decoded;
    next();
  });
}
