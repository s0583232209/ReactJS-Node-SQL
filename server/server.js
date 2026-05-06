import express from "express";
import cors from "cors";
import { configDotenv } from "dotenv";
import userRouter from "./routes/users.routes.js";
import tasksRouter from "./routes/tasks.routes.js";
import postsRouter from "./routes/posts.routes.js";
import commentsRouter from "./routes/comments.routes.js";
import { connect } from "./dal/OnlyConnectionInTheMeantime.js";
// import { Connection } from "mysql2";
import verifyToken from "./middleware/verifyToken.middleware.js";
import log from "./utils/logger.js";
import cookieParser from "cookie-parser";

configDotenv();

const app = express();
const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || "localhost";
// app.use(
//   cors({
//     origin: "http://localhost:3000", // your frontend URL
//     credentials: true,
//   }),
// );
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  console.log("got in");
  res.json({ message: "Server is running" });
});

app.use("/api", verifyToken);
app.use("/api/users", userRouter);
app.use("/api/:userId/tasks", tasksRouter);
app.use("/api/:userId/posts", postsRouter);
app.use("/api/:userId/comments", commentsRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!!!!!!!!!" });
});

await connect();
log.info("Database connected successfully");
app.listen(PORT, HOST, () => {
  log.info(`Server started on http://${HOST}:${PORT}`);
  console.log(`Server listening on http://${HOST}:${PORT}.`);
});
import crypto from "crypto";

// We generate a 256-bit (32-byte) secret and convert it to a hex string
const secret = crypto.randomBytes(32).toString("hex");
console.log(secret);
export default app;
