import "dotenv/config";

import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

import type { Variables } from "./types/context";
import { connectDB } from "./config/database";

// Routes
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import teacherRoutes from "./routes/teacher.routes";
import courseRoutes from "./routes/course.routes";
import assignmentRoutes from "./routes/assignment.routes";
import adminRoutes from "./routes/admin.routes";

// IMPORTANT: type the root app
const app = new Hono<{ Variables: Variables }>();

app.use("*", cors());
app.use("*", logger());

app.get("/", (c) => {
  return c.json({
    success: true,
    message: "Backend is running",
  });
});

// Route mounting (NO parentheses)
app.route("/auth", authRoutes);
app.route("/users", userRoutes);
app.route("/teachers", teacherRoutes);
app.route("/courses", courseRoutes);
app.route("/assignments", assignmentRoutes);
app.route("/admin", adminRoutes);

app.onError((err, c) => {
  console.error("Unhandled error:", err);
  return c.json({ success: false, message: "Internal Server Error" }, 500);
});

const PORT = Number(process.env.PORT) || 3001;

async function startServer() {
  try {
    await connectDB();
    console.log("Database connected");

    serve({
      fetch: app.fetch,
      port: PORT,
    });

    console.log(`Server running on port ${PORT}`);
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
