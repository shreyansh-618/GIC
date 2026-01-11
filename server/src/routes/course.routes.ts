import { Hono } from "hono";
import type { Variables } from "../types/context";
import { Course } from "../models/Course";
import { authMiddleware } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";
import { validateBody, isValidObjectId } from "../utils/validation";

const courseRoutes = new Hono<{ Variables: Variables }>();

courseRoutes.use("*", authMiddleware);

courseRoutes.post("/", requireRole("teacher", "admin"), async (c) => {
  const body = await c.req.json();

  const errors = validateBody(body, {
    title: { required: true, type: "string" },
    videoUrl: { required: true, type: "string" },
  });

  if (errors.length) return c.json({ errors }, 400);

  const course = await new Course({
    ...body,
    teacherId: c.get("user").id,
    status: "draft",
  }).save();

  return c.json({ course }, 201);
});

courseRoutes.post("/:courseId/enroll", async (c) => {
  const id = c.req.param("courseId");
  if (!isValidObjectId(id)) return c.json({ error: "Invalid ID" }, 400);

  const course = await Course.findByIdAndUpdate(
    id,
    { $addToSet: { students: c.get("user").id } },
    { new: true }
  );

  if (!course) return c.json({ error: "Course not found" }, 404);
  return c.json({ message: "Enrolled successfully" });
});

export default courseRoutes;
