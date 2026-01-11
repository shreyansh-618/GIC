import { Hono } from "hono";
import type { Variables } from "../types/context";
import { User } from "../models/User";
import { authMiddleware } from "../middleware/auth.middleware";

const userRoutes = new Hono<{ Variables: Variables }>();

// All user routes require authentication
userRoutes.use("*", authMiddleware);

/**
 * Get user profile
 * - Admin: any user
 * - Others: only self
 */
userRoutes.get("/:id", async (c) => {
  try {
    const paramId = c.req.param("id");
    const authUser = c.get("user");

    if (authUser.role !== "admin" && authUser.id !== paramId) {
      return c.json({ error: "Forbidden" }, 403);
    }

    const user = await User.findById(paramId).select("-password");
    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    return c.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        isVerified: user.isVerified,
        teacherId: user.teacherId,
      },
    });
  } catch (error) {
    console.error("Get user error:", error);
    return c.json({ error: "Failed to fetch user" }, 500);
  }
});

/**
 * Update user profile
 */
userRoutes.put("/:id", async (c) => {
  try {
    const paramId = c.req.param("id");
    const authUser = c.get("user");

    if (authUser.role !== "admin" && authUser.id !== paramId) {
      return c.json({ error: "Forbidden" }, 403);
    }

    const { name, email } = await c.req.json();

    const user = await User.findByIdAndUpdate(
      paramId,
      { name, email },
      { new: true }
    ).select("-password");

    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    return c.json({
      message: "User updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Update user error:", error);
    return c.json({ error: "Failed to update user" }, 500);
  }
});

/**
 * Get enrolled courses (student only)
 */
userRoutes.get("/:id/courses", async (c) => {
  try {
    const paramId = c.req.param("id");
    const authUser = c.get("user");

    if (authUser.role !== "student" || authUser.id !== paramId) {
      return c.json({ error: "Forbidden" }, 403);
    }

    const { Course } = await import("../models/Course");
    const courses = await Course.find({ students: paramId });

    return c.json({
      courses: courses.map((course) => ({
        id: course._id,
        title: course.title,
        description: course.description,
        videoUrl: course.videoUrl,
        notesUrl: course.notesUrl,
        status: course.status,
      })),
    });
  } catch (error) {
    console.error("Get courses error:", error);
    return c.json({ error: "Failed to fetch courses" }, 500);
  }
});

/**
 * Get user statistics
 */
userRoutes.get("/:id/stats", async (c) => {
  try {
    const paramId = c.req.param("id");
    const authUser = c.get("user");

    if (authUser.role !== "admin" && authUser.id !== paramId) {
      return c.json({ error: "Forbidden" }, 403);
    }

    const { Course } = await import("../models/Course");
    const { Assignment } = await import("../models/Assignment");

    const user = await User.findById(paramId);
    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    let stats: any = {
      role: user.role,
      status: user.status,
    };

    if (user.role === "student") {
      const enrolledCourses = await Course.countDocuments({
        students: paramId,
      });

      const submissions = await Assignment.aggregate([
        { $unwind: "$submissions" },
        { $match: { "submissions.studentId": paramId } },
        { $count: "total" },
      ]);

      stats = {
        ...stats,
        enrolledCourses,
        submissions: submissions[0]?.total || 0,
      };
    }

    if (user.role === "teacher") {
      const courses = await Course.countDocuments({
        teacherId: paramId,
      });

      const assignments = await Assignment.countDocuments({
        teacherId: paramId,
      });

      stats = {
        ...stats,
        courses,
        assignments,
      };
    }

    return c.json({ stats });
  } catch (error) {
    console.error("Get stats error:", error);
    return c.json({ error: "Failed to fetch stats" }, 500);
  }
});

export default userRoutes;
