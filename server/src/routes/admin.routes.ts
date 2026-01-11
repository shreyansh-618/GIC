import { Hono } from "hono";
import type { Variables } from "../types/context";
import { User } from "../models/User";
import { AccessCode } from "../models/AccessCode";
import { authMiddleware } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";
import { isValidObjectId } from "../utils/validation";

const adminRoutes = new Hono<{ Variables: Variables }>();
adminRoutes.use("*", authMiddleware);
adminRoutes.use("*", requireRole("admin"));

adminRoutes.post("/approve-teacher/:teacherId", async (c) => {
  const id = c.req.param("teacherId");
  if (!isValidObjectId(id)) return c.json({ error: "Invalid ID" }, 400);

  const teacher = await User.findById(id);
  if (!teacher || teacher.role !== "teacher")
    return c.json({ error: "Teacher not found" }, 404);

  const code = Math.floor(100000 + Math.random() * 900000).toString();

  await new AccessCode({
    code,
    teacherId: id,
    email: teacher.email,
    expiresAt: new Date(Date.now() + 86400000),
    createdBy: c.get("user").id,
  }).save();

  return c.json({ message: "Access code generated", code });
});

export default adminRoutes;
