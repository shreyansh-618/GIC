"use client";

import { Routes, Route } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { DashboardLayout } from "../../components/DashboardLayout";
import StudentHome from "./student/StudentHome";
import StudentCourses from "./student/StudentCourses";
import StudentAssignments from "./student/StudentAssignments";
import StudentCertificates from "./student/StudentCertificates";

export default function StudentDashboard() {
  const { user } = useAuth();

  return (
    <DashboardLayout role="student" userName={user?.email || "Student"}>
      <Routes>
        <Route path="/" element={<StudentHome />} />
        <Route path="/courses" element={<StudentCourses />} />
        <Route path="/assignments" element={<StudentAssignments />} />
        <Route path="/certificates" element={<StudentCertificates />} />
      </Routes>
    </DashboardLayout>
  );
}
