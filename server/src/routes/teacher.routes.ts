import { Hono } from "hono";
import type { Variables } from "../types/context";
import { AccessCode } from "../models/AccessCode";
import { User } from "../models/User";
import { authMiddleware } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";
import { validateOTP } from "../utils/validation";

const teacherRoutes = new Hono<{ Variables: Variables }>();

teacherRoutes.use("*", authMiddleware);
teacherRoutes.use("*", requireRole("teacher", "admin"));

teacherRoutes.post("/verify-code", async (c) => {
  try {
    const { code } = await c.req.json();
    if (!validateOTP(code))
      return c.json({ error: "Invalid access code" }, 400);

    const user = c.get("user");

    const accessCode = await AccessCode.findOne({
      code,
      teacherId: user.id,
      isUsed: false,
      expiresAt: { $gt: new Date() },
    });

    if (!accessCode) return c.json({ error: "Invalid or expired code" }, 400);

    accessCode.isUsed = true;
    accessCode.usedAt = new Date();
    await accessCode.save();

    await User.findByIdAndUpdate(user.id, {
      isVerified: true,
      status: "active",
    });

    return c.json({ message: "Teacher verified successfully" });
  } catch (e) {
    console.error(e);
    return c.json({ error: "Verification failed" }, 500);
  }
});

export default teacherRoutes;
