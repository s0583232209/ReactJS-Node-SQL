import express from "express";
import cors from "cors";
import { configDotenv } from "dotenv";
import userRouter from "./routes/users.routes.js";
import tasksRouter from "./routes/tasks.routes.js";
import postsRouter from "./routes/posts.routes.js";
import commentsRouter from "./routes/comments.routes.js";
import { connect, buildDataBase } from "./dal/OnlyConnectionInTheMeantime.js";
import { Connection } from "mysql2";
// import router from "./controllers/users.controller.js";
configDotenv();

const app = express();
const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || "localhost";
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  console.log("got in");
  res.json({ message: "Server is running" });
});

app.use("/api/users", userRouter);
app.use("/api/tasks", tasksRouter);
app.use("/api/posts", postsRouter);
app.use("/api/comments", commentsRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!!!!!!!!!" });
});

await connect();
// await buildDataBase();
app.listen(PORT, HOST, () => {
  console.log(`Server listening on http://${HOST}:${PORT}`);
});

export default app;
