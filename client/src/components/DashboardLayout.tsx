"use client";

import type React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, type UserRole } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  LogOut,
  Home,
  BookOpen,
  Users,
  FileText,
  Award,
  ChevronDown,
} from "lucide-react";

interface DashboardLayoutProps {
  role: UserRole;
  userName: string;
  children: React.ReactNode;
  brandName?: string;
}

export function DashboardLayout({
  role,
  userName,
  children,
  brandName = "Institute Portal",
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const menuItems = (() => {
    const base = [{ label: "Dashboard", icon: Home, href: `/${role}` }];

    if (role === "student") {
      return [
        ...base,
        { label: "Courses", icon: BookOpen, href: "/student/courses" },
        { label: "Assignments", icon: FileText, href: "/student/assignments" },
        { label: "Certificates", icon: Award, href: "/student/certificates" },
      ];
    }

    if (role === "teacher") {
      return [
        ...base,
        { label: "My Courses", icon: BookOpen, href: "/teacher/courses" },
        { label: "Assignments", icon: FileText, href: "/teacher/assignments" },
      ];
    }

    if (role === "admin") {
      return [
        ...base,
        { label: "Users", icon: Users, href: "/admin/users" },
        { label: "Courses", icon: BookOpen, href: "/admin/courses" },
        { label: "Requests", icon: FileText, href: "/admin/requests" },
      ];
    }

    return base;
  })();

  const safeUserName = userName || "User";
  const displayName = safeUserName.split("@")[0];
  const userInitial = displayName.charAt(0).toUpperCase();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`hidden md:flex ${
          sidebarOpen ? "w-64" : "w-20"
        } bg-white border-r transition-all duration-300 flex-col`}
      >
        <div className="p-4 border-b flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                G
              </div>
              <span className="font-semibold">{brandName}</span>
            </div>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X /> : <Menu />}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.href}
              onClick={() => navigate(item.href)}
              className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-50"
            >
              <item.icon className="w-5 h-5" />
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full justify-start gap-2"
          >
            <LogOut className="w-4 h-4" />
            {sidebarOpen && "Logout"}
          </Button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col">
        <header className="bg-white border-b px-6 py-4 flex justify-between">
          <div>
            <h2 className="text-lg font-semibold">Welcome, {displayName}</h2>
            <p className="text-sm text-gray-500 capitalize">{role} dashboard</p>
          </div>

          <div className="relative">
            <button
              onClick={() => setUserMenuOpen((p) => !p)}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center">
                {userInitial}
              </div>
              <ChevronDown />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow">
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6">{children}</div>
      </main>
    </div>
  );
}
