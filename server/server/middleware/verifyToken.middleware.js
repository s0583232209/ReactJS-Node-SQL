import jwt from "jsonwebtoken";
import log from "../utils/logger.js";

export default async function verifyToken(req, res, next) {
  log.info(`verifyToken - path: ${req.path}`);
  if (req.path.includes("/auth/")) {
    log.info(`verifyToken - skipping auth routes`);
    return next();
  }
  const token = req.cookies.access_token;
  if (!token) {
    log.warn(`verifyToken - no token provided for path: ${req.path}`);
    return res.status(401).send("No token provided");
  }
  try {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        log.error(`verifyToken - verification error: ${err.message}`);
        return res.status(403).send("Failed to authenticate");
      }
      req.user = decoded;
      log.info(
        `verifyToken - successful for user: ${decoded.email} (userId: ${decoded.userId})`,
      );
      next();
    });
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      log.warn(`verifyToken - session timeout`);
      return res.status(401).send("Session timeout");
    }
    log.error(`verifyToken - error: ${err.message}`);
    return res.status(403).send("Failed to authenticate");
  }
}
