export default async function checkAccessPermissions(req, res, next) {
  if (req.path.includes("/auth/")||req.params.userId=="auth") return next();
  console.log("Checking access permissions for user:", req.path);
  console.log("Checking access permissions for user:", req.user);
  console.log("Checking access permissions for userId:",req.params.userId);
  if (req.user.userId == req.params.userId) return next();
  res.status(900).send("Access Denied")
}
