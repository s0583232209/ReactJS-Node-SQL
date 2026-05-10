import log from "../utils/logger.js";

export default async function checkAccessPermissions(req, res, next) {
  if (req.path.includes("/auth/") || req.params.userId == "auth") return next();
  log.info(
    `checkAccessPermissions - path: ${req.path}, userId param: ${req.params.userId}`,
  );
  if (!req.user) {
    log.warn(
      `checkAccessPermissions - req.user is undefined for path: ${req.path}`,
    );
    return next();
  }
  log.info(
    `checkAccessPermissions - user ID from token: ${req.user.userId}, userId param: ${req.params.userId}`,
  );
  if (req.user.userId == req.params.userId) {
    log.info(
      `checkAccessPermissions - access granted for user: ${req.user.userId}`,
    );
    return next();
  }
  log.warn(
    `checkAccessPermissions - access denied: token userId ${req.user.userId} != param userId ${req.params.userId}`,
  );
  res.status(403).send("Access Denied");
}
