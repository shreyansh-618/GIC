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
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  FileText,
  Users,
  Plus,
  AlertCircle,
  TrendingUp,
  Clock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function TeacherHome() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">
            Teaching Dashboard
          </h1>
          <p className="text-gray-600">
            Manage your courses and student progress
          </p>
        </div>
        <Button
          onClick={() => navigate("/teacher/courses/create")}
          className="gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Create Course
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">
              My Courses
            </CardTitle>
            <div className="p-2 bg-blue-100 rounded-lg">
              <BookOpen className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">2</div>
            <p className="text-xs text-gray-500 mt-1">Published courses</p>
            <div className="mt-3 flex items-center gap-1 text-xs text-blue-600">
              <TrendingUp className="w-3 h-3" />
              <span>Growing</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">
              Total Students
            </CardTitle>
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">24</div>
            <p className="text-xs text-gray-500 mt-1">Enrolled students</p>
            <div className="mt-3 flex items-center gap-1 text-xs text-purple-600">
              <TrendingUp className="w-3 h-3" />
              <span>+3 this week</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">
              Pending Reviews
            </CardTitle>
            <div className="p-2 bg-orange-100 rounded-lg">
              <FileText className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">3</div>
            <p className="text-xs text-gray-500 mt-1">Awaiting grading</p>
            <div className="mt-3 flex items-center gap-1 text-xs text-orange-600">
              <Clock className="w-3 h-3" />
              <span>Action needed</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Your Courses */}
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Your Courses</CardTitle>
              <CardDescription>Manage and monitor your courses</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Course 1 */}
              <div className="p-4 border border-gray-100 rounded-lg hover:border-blue-200 hover:bg-blue-50/30 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">
                      Introduction to Commerce
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      12 students enrolled • 5 modules
                    </p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Completion Rate</span>
                    <span className="font-medium text-gray-900">68%</span>
                  </div>
                  <Progress value={68} className="h-2" />
                </div>
              </div>

              {/* Course 2 */}
              <div className="p-4 border border-gray-100 rounded-lg hover:border-blue-200 hover:bg-blue-50/30 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">
                      Business Economics
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      12 students enrolled • 4 modules
                    </p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Completion Rate</span>
                    <span className="font-medium text-gray-900">52%</span>
                  </div>
                  <Progress value={52} className="h-2" />
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full bg-transparent hover:bg-gray-50"
                onClick={() => navigate("/teacher/courses")}
              >
                View All Courses
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Pending Reviews */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Pending Reviews</CardTitle>
            <CardDescription>Submissions to grade</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-orange-900">
                    3 assignments pending
                  </p>
                  <p className="text-xs text-orange-700 mt-1">
                    Average wait time: 2 days
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm">
                <p className="font-medium text-gray-900">Case Study Analysis</p>
                <p className="text-xs text-gray-600">5 submissions</p>
              </div>
              <div className="text-sm">
                <p className="font-medium text-gray-900">Midterm Exam</p>
                <p className="text-xs text-gray-600">3 submissions</p>
              </div>
            </div>

            <Button
              className="w-full"
              onClick={() => navigate("/teacher/assignments")}
            >
              Review Now
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
