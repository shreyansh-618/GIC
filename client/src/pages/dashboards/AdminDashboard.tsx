"use client";

import { Routes, Route } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { DashboardLayout } from "../../components/DashboardLayout";
import AdminHome from "./admin/AdminHome";
import AdminUsers from "./admin/AdminUsers";
import AdminCourses from "./admin/AdminCourses";
import AdminRequests from "./admin/AdminRequests";

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <DashboardLayout role="admin" userName={user?.email || "Admin"}>
      <Routes>
        <Route path="/" element={<AdminHome />} />
        <Route path="/users" element={<AdminUsers />} />
        <Route path="/courses" element={<AdminCourses />} />
        <Route path="/requests" element={<AdminRequests />} />
      </Routes>
    </DashboardLayout>
  );
}
