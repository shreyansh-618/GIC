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
}

export function DashboardLayout({
  role,
  userName,
  children,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const getMenuItems = () => {
    const baseItems = [{ label: "Dashboard", icon: Home, href: `/${role}` }];

    if (role === "student") {
      return [
        ...baseItems,
        { label: "Courses", icon: BookOpen, href: `/${role}/courses` },
        { label: "Assignments", icon: FileText, href: `/${role}/assignments` },
        { label: "Certificates", icon: Award, href: `/${role}/certificates` },
      ];
    }

    if (role === "teacher") {
      return [
        ...baseItems,
        { label: "My Courses", icon: BookOpen, href: `/${role}/courses` },
        { label: "Assignments", icon: FileText, href: `/${role}/assignments` },
      ];
    }

    if (role === "admin") {
      return [
        ...baseItems,
        { label: "Users", icon: Users, href: `/${role}/users` },
        { label: "Courses", icon: BookOpen, href: `/${role}/courses` },
        { label: "Requests", icon: FileText, href: `/${role}/requests` },
      ];
    }

    return baseItems;
  };

  const menuItems = getMenuItems();
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex ${
          sidebarOpen ? "w-64" : "w-20"
        } bg-white border-r border-gray-200 transition-all duration-300 flex-col shadow-sm`}
      >
        {/* Logo Section */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">GIC</span>
              </div>
              <h1 className="font-bold text-lg text-gray-900">Gupta Institute of Commerce</h1>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {sidebarOpen ? (
              <X className="w-5 h-5 text-gray-600" />
            ) : (
              <Menu className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item, index) => (
            <button
              key={item.href}
              onClick={() => navigate(item.href)}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-all duration-200 group"
              title={!sidebarOpen ? item.label : ""}
              style={{
                animation: `slideIn 0.3s ease-out ${index * 50}ms both`,
              }}
            >
              <item.icon className="w-5 h-5 flex-shrink-0 group-hover:scale-110 transition-transform" />
              {sidebarOpen && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
            </button>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-100">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full justify-start gap-2 bg-transparent hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all"
          >
            <LogOut className="w-4 h-4" />
            {sidebarOpen && "Logout"}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">G</span>
            </div>
            <h1 className="font-bold text-lg text-gray-900">Gupta</h1>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 hover:bg-gray-100 rounded-lg"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </header>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-200 p-4 space-y-2 animate-in slide-in-from-top-2 duration-200">
            {menuItems.map((item) => (
              <button
                key={item.href}
                onClick={() => {
                  navigate(item.href);
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-all"
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            ))}
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full justify-start gap-2 mt-2 bg-transparent hover:bg-red-50 hover:text-red-600"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        )}

        {/* Desktop Header */}
        <header className="hidden md:flex bg-white border-b border-gray-200 px-6 py-4 items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Welcome back, {userName.split("@")[0]}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Manage your {role} account
            </p>
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {userInitial}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-gray-900">
                  {userName.split("@")[0]}
                </p>
                <p className="text-xs text-gray-500 capitalize">{role}</p>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-gray-600 transition-transform ${
                  userMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* User Dropdown */}
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">
                    {userName}
                  </p>
                  <p className="text-xs text-gray-500 capitalize mt-1">
                    {role} Account
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 md:p-6 animate-in fade-in duration-300">
          {children}
        </div>
      </main>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
