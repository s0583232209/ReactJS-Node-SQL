import express from "express";
import cors from "cors";
import { configDotenv } from "dotenv";
import userRouter from "./routes/users.routes.js";

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

app.use((err, req, res, next) => {
  console.error(err.stack);
<<<<<<< HEAD
  res.status(500).json({ error: "Something went wrong!!!" });
=======
  res.status(500).json({ error: "Something went wrong!!!!!!!!!" });
>>>>>>> a93b80105e7bfa60a89d4a33aae0ec7398200864
});

app.listen(PORT, HOST, () => {
  console.log(`Server listening on http://${HOST}:${PORT}`);
});

export default app;
