import { Context, Next } from "hono";

type Role = "student" | "teacher" | "admin";

export const requireRole =
  (...allowedRoles: Role[]) =>
  async (c: Context, next: Next) => {
    const user = c.get("user") as { id: string; role: Role } | undefined;

    if (!user || !allowedRoles.includes(user.role)) {
      return c.json({ success: false, message: "Forbidden" }, 403);
    }

    await next();
  };
