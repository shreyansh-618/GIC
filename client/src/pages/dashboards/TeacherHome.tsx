"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  FileText,
  Users,
  Plus,
  AlertCircle,
  TrendingUp,
  Clock,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DashboardData {
  stats: {
    courses: number;
    students: number;
    pendingReviews: number;
  };
  courses: {
    id: string;
    title: string;
    students: number;
    modules: number;
    completionRate: number;
    status: "active" | "inactive";
  }[];
  pendingAssignments: {
    title: string;
    count: number;
  }[];
}

export default function TeacherHome() {
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await apiRequest("/teacher/dashboard");
      setData(res);
    } catch (err) {
      console.error("Failed to load teacher dashboard", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12 text-gray-600">
        Failed to load dashboard
      </div>
    );
  }

  const { stats, courses, pendingAssignments } = data;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">
            Teaching Dashboard
          </h1>
          <p className="text-gray-600">
            Manage your courses and student progress
          </p>
        </div>
        <Button
          onClick={() => navigate("/teacher/courses/create")}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Course
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="My Courses"
          value={stats.courses}
          icon={<BookOpen className="h-4 w-4 text-blue-600" />}
        />
        <StatCard
          title="Total Students"
          value={stats.students}
          icon={<Users className="h-4 w-4 text-purple-600" />}
        />
        <StatCard
          title="Pending Reviews"
          value={stats.pendingReviews}
          icon={<FileText className="h-4 w-4 text-orange-600" />}
        />
      </div>

      {/* Courses */}
      <Card>
        <CardHeader>
          <CardTitle>Your Courses</CardTitle>
          <CardDescription>Live course performance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {courses.length === 0 ? (
            <p className="text-sm text-gray-600">No courses yet</p>
          ) : (
            courses.map((c) => (
              <div
                key={c.id}
                className="p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex justify-between mb-2">
                  <div>
                    <p className="font-semibold">{c.title}</p>
                    <p className="text-sm text-gray-600">
                      {c.students} students • {c.modules} modules
                    </p>
                  </div>
                  <Badge>{c.status}</Badge>
                </div>
                <Progress value={c.completionRate} className="h-2" />
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Pending Reviews */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Reviews</CardTitle>
          <CardDescription>Assignments to grade</CardDescription>
        </CardHeader>
        <CardContent>
          {pendingAssignments.length === 0 ? (
            <p className="text-sm text-gray-600">No pending reviews</p>
          ) : (
            pendingAssignments.map((a, i) => (
              <div key={i} className="flex justify-between text-sm mb-2">
                <span>{a.title}</span>
                <span>{a.count} submissions</span>
              </div>
            ))
          )}
          <Button
            className="w-full mt-4"
            onClick={() => navigate("/teacher/assignments")}
          >
            Review Now
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}
