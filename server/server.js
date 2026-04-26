import express from 'express';
import { configDotenv } from "dotenv";
import userRouter from './routes/users.routes.js'
configDotenv();
const app=express();
app.use(express.json()); 
app.use("/api/users",userRouter)
app.listen(process.env.PORT, process.env.HOST, () => {
  console.log("listening");
});