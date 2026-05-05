import jwt from "jsonwebtoken";
export default async function verifyToken(req, res, next) {
  console.log("in token middleware");
  if (req.url.endsWith("/signup") || req.url.endsWith("/login")) return next();
  console.log("second token middleware console");
  const token = req.cookies.access_token;
  console.log("req",req.cookies);
  if (!token) return res.status(401).send("No token provided");
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log(`verifyToken error: ${err.message}`);
      return res.status(403).send("Failed to authenticate");
    }
    req.user = decoded;
    console.log(`verifyToken successful for user: ${decoded.email}`);
    next();
  });
}
