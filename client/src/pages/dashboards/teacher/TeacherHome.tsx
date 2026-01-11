"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../../lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, FileText, Users, Plus, Loader2 } from "lucide-react";

interface DashboardData {
  stats: {
    courses: number;
    students: number;
    pendingAssignments: number;
  };
  recentCourses: {
    id: string;
    title: string;
    students: number;
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
      <div className="text-center text-gray-500 py-12">
        Failed to load dashboard
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Teaching Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your courses and student assignments
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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">My Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.stats.courses}</div>
            <p className="text-xs text-gray-600">Published courses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Students</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.stats.students}</div>
            <p className="text-xs text-gray-600">Enrolled students</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Assignments</CardTitle>
            <FileText className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.stats.pendingAssignments}
            </div>
            <p className="text-xs text-gray-600">Pending reviews</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Courses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Your Courses</CardTitle>
            <CardDescription>Recently created courses</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.recentCourses.length === 0 ? (
              <p className="text-sm text-gray-500">No courses yet</p>
            ) : (
              data.recentCourses.map((course) => (
                <div key={course.id} className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium">{course.title}</p>
                  <p className="text-sm text-gray-600">
                    {course.students} students enrolled
                  </p>
                </div>
              ))
            )}
            <Button
              variant="outline"
              className="w-full bg-transparent"
              onClick={() => navigate("/teacher/courses")}
            >
              View All Courses
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Reviews</CardTitle>
            <CardDescription>
              Student submissions awaiting grading
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
              <p className="font-medium text-sm">
                {data.stats.pendingAssignments} assignments pending
              </p>
              <p className="text-xs text-gray-600">
                Review and grade submissions
              </p>
            </div>
            <Button
              variant="outline"
              className="w-full bg-transparent"
              onClick={() => navigate("/teacher/assignments")}
            >
              Review Assignments
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
