import { Hono } from "hono";
import type { Variables } from "../types/context";
import { User } from "../models/User";
import { authMiddleware } from "../middleware/auth.middleware";
import { isValidObjectId, validateBody } from "../utils/validation";

const userRoutes = new Hono<{ Variables: Variables }>();

userRoutes.use("*", authMiddleware);

userRoutes.get("/:id", async (c) => {
  const id = c.req.param("id");
  const auth = c.get("user");

  if (!isValidObjectId(id)) {
    return c.json({ error: "Invalid ID" }, 400);
  }

  if (auth.role !== "admin" && auth.id !== id) {
    return c.json({ error: "Forbidden" }, 403);
  }

  const user = await User.findById(id).select("-password");
  if (!user) {
    return c.json({ error: "User not found" }, 404);
  }

  return c.json({ user });
});

userRoutes.put("/:id", async (c) => {
  const id = c.req.param("id");
  const auth = c.get("user");

  if (!isValidObjectId(id)) {
    return c.json({ error: "Invalid ID" }, 400);
  }

  if (auth.role !== "admin" && auth.id !== id) {
    return c.json({ error: "Forbidden" }, 403);
  }

  const body = await c.req.json();
  const errors = validateBody(body, {
    name: { type: "string", minLength: 2 },
    email: { type: "string" },
  });

  if (errors.length) {
    return c.json({ errors }, 400);
  }

  const user = await User.findByIdAndUpdate(id, body, {
    new: true,
  }).select("-password");

  return c.json({ user });
});

export default userRoutes;
