import express from "express";
import authRoutes from "./Routes/auth.route.js";
import dotenv from "dotenv";
import { ConnectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import messageRoute from "./Routes/message.route.js"
import cors from "cors";
import { app, server } from "./lib/socket.js"
import path from "path";

dotenv.config();

const PORT = process.env.PORT;
const __dirname = path.resolve();

app.use(express.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: "https://chat-app-aqbx.vercel.app",
  credentials: true
}));

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoute);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
  });
}
app.get("/", (req, res) => {
  res.send("Hello from server");
});


server.listen(3000, () => {
  console.log("server running on " + PORT);
  ConnectDB();

})
