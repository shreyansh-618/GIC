import { Hono } from "hono";
import { Assignment } from "../models/Assignment";

const assignmentRoutes = new Hono();

// Create assignment
assignmentRoutes.post("/", async (c) => {
  try {
    const { title, description, courseId, teacherId, dueDate } =
      await c.req.json();

    if (!title || !courseId || !teacherId || !dueDate) {
      return c.json({ error: "Missing required fields" }, { status: 400 });
    }

    const assignment = new Assignment({
      title,
      description,
      courseId,
      teacherId,
      dueDate: new Date(dueDate),
    });

    await assignment.save();

    return c.json(
      {
        message: "Assignment created successfully",
        assignment: {
          id: assignment._id,
          title: assignment.title,
          dueDate: assignment.dueDate,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create assignment error:", error);
    return c.json({ error: "Failed to create assignment" }, { status: 500 });
  }
});

// Get assignments by course
assignmentRoutes.get("/course/:courseId", async (c) => {
  try {
    const courseId = c.req.param("courseId");

    const assignments = await Assignment.find({ courseId });

    return c.json({
      assignments: assignments.map((assignment) => ({
        id: assignment._id,
        title: assignment.title,
        description: assignment.description,
        dueDate: assignment.dueDate,
        submissions: assignment.submissions.length,
      })),
    });
  } catch (error) {
    console.error("Get assignments error:", error);
    return c.json({ error: "Failed to fetch assignments" }, { status: 500 });
  }
});

// Submit assignment
assignmentRoutes.post("/:assignmentId/submit", async (c) => {
  try {
    const assignmentId = c.req.param("assignmentId");
    const { studentId, content } = await c.req.json();

    if (!studentId || !content) {
      return c.json(
        { error: "Student ID and content required" },
        { status: 400 }
      );
    }

    const assignment = await Assignment.findByIdAndUpdate(
      assignmentId,
      {
        $push: {
          submissions: {
            studentId,
            content,
            submittedAt: new Date(),
          },
        },
      },
      { new: true }
    );

    if (!assignment) {
      return c.json({ error: "Assignment not found" }, { status: 404 });
    }

    return c.json({
      message: "Assignment submitted successfully",
      assignment: {
        id: assignment._id,
        title: assignment.title,
      },
    });
  } catch (error) {
    console.error("Submit assignment error:", error);
    return c.json({ error: "Failed to submit assignment" }, { status: 500 });
  }
});

export default assignmentRoutes;
