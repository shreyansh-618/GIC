import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "../models/User";
import { Course } from "../models/Course";
import { hashPassword } from "../utils/password";

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/gupta-institute"
    );
    console.log("Connected to MongoDB");

    // Clear existing data
    await User.deleteMany({});
    await Course.deleteMany({});
    console.log("Cleared existing data");

    // Create admin user
    const adminPassword = await hashPassword("Admin@123");
    const admin = new User({
      name: "Admin User",
      email: "admin@guptainstitute.com",
      password: adminPassword,
      role: "admin",
      status: "active",
      isVerified: true,
    });
    await admin.save();
    console.log("Admin user created");

    // Create sample students
    const studentPassword = await hashPassword("Student@123");
    const students = [];
    for (let i = 1; i <= 3; i++) {
      const student = new User({
        name: `Student ${i}`,
        email: `student${i}@guptainstitute.com`,
        password: studentPassword,
        role: "student",
        status: "active",
        isVerified: true,
      });
      await student.save();
      students.push(student);
    }
    console.log("Sample students created");

    // Create sample teacher
    const teacherPassword = await hashPassword("Teacher@123");
    const teacher = new User({
      name: "Sample Teacher",
      email: "teacher@guptainstitute.com",
      password: teacherPassword,
      role: "teacher",
      teacherId: "TEACH001",
      status: "active",
      isVerified: true,
    });
    await teacher.save();
    console.log("Sample teacher created");

    // Create sample courses
    const course1 = new Course({
      title: "Introduction to Commerce",
      description: "Learn the basics of commerce and business principles",
      teacherId: teacher._id.toString(),
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      notesUrl: "https://drive.google.com/file/d/sample",
      students: students.map((s) => s._id.toString()),
      status: "published",
    });
    await course1.save();

    const course2 = new Course({
      title: "Advanced Accounting",
      description: "Master advanced accounting concepts and practices",
      teacherId: teacher._id.toString(),
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      notesUrl: "https://drive.google.com/file/d/sample",
      students: [students[0]._id.toString(), students[1]._id.toString()],
      status: "published",
    });
    await course2.save();

    console.log("Sample courses created");
    console.log("Database seeded successfully!");

    await mongoose.disconnect();
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedDatabase();
