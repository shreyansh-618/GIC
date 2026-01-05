"use client";

import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, FileText, Users, Plus } from "lucide-react";

export default function TeacherHome() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-gray-600">Published courses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Students</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-gray-600">Enrolled students</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assignments</CardTitle>
            <FileText className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-gray-600">Pending reviews</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Your Courses</CardTitle>
            <CardDescription>Recently created courses</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="font-medium">Introduction to Commerce</p>
              <p className="text-sm text-gray-600">12 students enrolled</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="font-medium">Business Economics</p>
              <p className="text-sm text-gray-600">12 students enrolled</p>
            </div>
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
              <p className="font-medium text-sm">3 assignments pending</p>
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
