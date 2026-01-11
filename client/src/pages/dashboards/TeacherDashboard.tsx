"use client";

import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { DashboardLayout } from "../../components/DashboardLayout";
import TeacherHome from "./teacher/TeacherHome";
import TeacherCourses from "./teacher/TeacherCourses";
import TeacherAssignments from "./teacher/TeacherAssignments";
import CreateCourse from "./teacher/CreateCourse";

export default function TeacherDashboard() {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!user || user.role !== "teacher") {
    return <Navigate to="/login" replace />;
  }

  return (
    <DashboardLayout role="teacher" userName={user.email}>
      <Routes>
        <Route index element={<TeacherHome />} />
        <Route path="courses" element={<TeacherCourses />} />
        <Route path="courses/create" element={<CreateCourse />} />
        <Route path="assignments" element={<TeacherAssignments />} />
      </Routes>
    </DashboardLayout>
  );
}
