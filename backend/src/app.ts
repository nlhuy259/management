import express from "express";
import cors from "cors";
import { json } from "body-parser";
import authRoutes from "./routes/auth.routes";
import taskRoutes from "./routes/task.routes";
import messageRoutes from "./routes/message.routes";
import userRoutes from "./routes/user.routes";

const app = express();
app.use(cors({ origin: "*", credentials: true }));
app.use(json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

export default app;
