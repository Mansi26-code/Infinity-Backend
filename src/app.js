import express from "express";
import userRouter from "./Routers/userRouter.js";
import postRouter from "./Routers/postRouter.js";
import followRouter from "./Routers/followRouter.js";
import notificationRouter from "./Routers/notificationRouter.js";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
import cors from "cors";
import redisClient from "./utils/redisClient.js";

export const app = express();

config({
  path: "./.env",
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        origin.match(/^https?:\/\/(.*\.)?vercel\.app$/) ||
        origin === "https://infinitybackend-jet.vercel.app"
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

app.use("/api/v1/user", userRouter);
app.use("/api/v1/post", postRouter);
app.use("/api/v1/follow", followRouter);
app.use("/api/v1/notification", notificationRouter);

app.get("/", (req, res) => {
  res.send("Server is working fine");
});

app.get("/api/v1/redis-status", async (req, res) => {
  try {
    const pingResponse = await redisClient.ping();
    res.json({ success: true, message: "Redis is connected", response: pingResponse });
  } catch (error) {
    console.error("Redis error:", error);
    res.status(500).json({ success: false, message: "Redis is not connected" });
  }
});
