import { Hono } from "hono";
import type { Variables } from "../types/context";
import { User } from "../models/User";
import { AccessCode } from "../models/AccessCode";
import { authMiddleware } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";

const adminRoutes = new Hono<{ Variables: Variables }>();

// Protect all admin routes
adminRoutes.use("*", authMiddleware);
adminRoutes.use("*", requireRole("admin"));

/**
 * Get pending teacher requests
 */
adminRoutes.get("/pending-teachers", async (c) => {
  try {
    const pendingTeachers = await User.find({
      role: "teacher",
      status: "pending",
    }).select("-password");

    return c.json({
      teachers: pendingTeachers.map((teacher) => ({
        id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        status: teacher.status,
        createdAt: teacher.createdAt,
      })),
    });
  } catch (error) {
    console.error("Get pending teachers error:", error);
    return c.json({ error: "Failed to fetch pending teachers" }, 500);
  }
});

/**
 * Approve teacher & generate access code
 */
adminRoutes.post("/approve-teacher/:teacherId", async (c) => {
  try {
    const teacherId = c.req.param("teacherId");
    const admin = c.get("user");

    const teacher = await User.findById(teacherId);
    if (!teacher || teacher.role !== "teacher") {
      return c.json({ error: "Teacher not found" }, 404);
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    const accessCode = new AccessCode({
      code,
      teacherId: teacher._id.toString(),
      email: teacher.email,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      createdBy: admin.id,
    });

    await accessCode.save();

    return c.json({
      message: "Teacher approved. Access code generated.",
      accessCode: {
        code,
        email: teacher.email,
        expiresAt: accessCode.expiresAt,
      },
    });
  } catch (error) {
    console.error("Approve teacher error:", error);
    return c.json({ error: "Failed to approve teacher" }, 500);
  }
});

/**
 * Reject teacher request
 */
adminRoutes.post("/reject-teacher/:teacherId", async (c) => {
  try {
    const teacherId = c.req.param("teacherId");

    const teacher = await User.findByIdAndUpdate(
      teacherId,
      { status: "inactive" },
      { new: true }
    );

    if (!teacher) {
      return c.json({ error: "Teacher not found" }, 404);
    }

    return c.json({
      message: "Teacher request rejected",
      teacher: {
        id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        status: teacher.status,
      },
    });
  } catch (error) {
    console.error("Reject teacher error:", error);
    return c.json({ error: "Failed to reject teacher" }, 500);
  }
});

/**
 * Get all users
 */
adminRoutes.get("/users", async (c) => {
  try {
    const users = await User.find().select("-password");

    return c.json({
      users: users.map((user) => ({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
      })),
    });
  } catch (error) {
    console.error("Get users error:", error);
    return c.json({ error: "Failed to fetch users" }, 500);
  }
});

export default adminRoutes;
