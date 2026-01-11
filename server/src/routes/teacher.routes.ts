import { Hono } from "hono";
import type { Variables } from "../types/context";
import { AccessCode } from "../models/AccessCode";
import { User } from "../models/User";
import { authMiddleware } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";

const teacherRoutes = new Hono<{ Variables: Variables }>();

// Protect all teacher routes
teacherRoutes.use("*", authMiddleware);
teacherRoutes.use("*", requireRole("teacher", "admin"));

/**
 * Verify access code (teacher self-verification)
 */
teacherRoutes.post("/verify-code", async (c) => {
  try {
    const { code } = await c.req.json();

    if (!code) {
      return c.json(
        { success: false, message: "Access code is required" },
        400
      );
    }

    const user = c.get("user");
    const userId = user.id;

    const accessCode = await AccessCode.findOne({
      code,
      teacherId: userId,
      isUsed: false,
      expiresAt: { $gt: new Date() },
    });

    if (!accessCode) {
      return c.json(
        { success: false, message: "Invalid or expired code" },
        400
      );
    }

    accessCode.isUsed = true;
    accessCode.usedAt = new Date();
    await accessCode.save();

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { isVerified: true, status: "active" },
      { new: true }
    );

    if (!updatedUser) {
      return c.json({ success: false, message: "User not found" }, 404);
    }

    return c.json({
      success: true,
      message: "Teacher verified successfully",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isVerified: updatedUser.isVerified,
        status: updatedUser.status,
      },
    });
  } catch (error) {
    console.error("Verification error:", error);
    return c.json({ success: false, message: "Verification failed" }, 500);
  }
});

export default teacherRoutes;
