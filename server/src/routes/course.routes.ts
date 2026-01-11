import { Hono } from "hono";
import { Course } from "../models/Course";

const courseRoutes = new Hono();

// Create course
courseRoutes.post("/", async (c) => {
  try {
    const { title, description, teacherId, videoUrl, notesUrl } =
      await c.req.json();

    if (!title || !teacherId || !videoUrl) {
      return c.json({ error: "Missing required fields" }, { status: 400 });
    }

    const course = new Course({
      title,
      description,
      teacherId,
      videoUrl,
      notesUrl,
      status: "draft",
    });

    await course.save();

    return c.json(
      {
        message: "Course created successfully",
        course: {
          id: course._id,
          title: course.title,
          description: course.description,
          status: course.status,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create course error:", error);
    return c.json({ error: "Failed to create course" }, { status: 500 });
  }
});

// Get courses by teacher
courseRoutes.get("/teacher/:teacherId", async (c) => {
  try {
    const teacherId = c.req.param("teacherId");

    const courses = await Course.find({ teacherId });

    return c.json({
      courses: courses.map((course) => ({
        id: course._id,
        title: course.title,
        description: course.description,
        videoUrl: course.videoUrl,
        notesUrl: course.notesUrl,
        students: course.students.length,
        status: course.status,
      })),
    });
  } catch (error) {
    console.error("Get courses error:", error);
    return c.json({ error: "Failed to fetch courses" }, { status: 500 });
  }
});

// Get all published courses
courseRoutes.get("/", async (c) => {
  try {
    const courses = await Course.find({ status: "published" });

    return c.json({
      courses: courses.map((course) => ({
        id: course._id,
        title: course.title,
        description: course.description,
        videoUrl: course.videoUrl,
        notesUrl: course.notesUrl,
        students: course.students.length,
        status: course.status,
      })),
    });
  } catch (error) {
    console.error("Get courses error:", error);
    return c.json({ error: "Failed to fetch courses" }, { status: 500 });
  }
});

// Enroll student in course
courseRoutes.post("/:courseId/enroll", async (c) => {
  try {
    const courseId = c.req.param("courseId");
    const { studentId } = await c.req.json();

    if (!studentId) {
      return c.json({ error: "Student ID required" }, { status: 400 });
    }

    const course = await Course.findByIdAndUpdate(
      courseId,
      { $addToSet: { students: studentId } },
      { new: true }
    );

    if (!course) {
      return c.json({ error: "Course not found" }, { status: 404 });
    }

    return c.json({
      message: "Enrolled successfully",
      course: {
        id: course._id,
        title: course.title,
        students: course.students.length,
      },
    });
  } catch (error) {
    console.error("Enroll error:", error);
    return c.json({ error: "Failed to enroll" }, { status: 500 });
  }
});

export default courseRoutes;
