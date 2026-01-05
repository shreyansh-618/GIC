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
  Award,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function StudentHome() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-gray-900">
          My Learning Journey
        </h1>
        <p className="text-gray-600">
          Track your progress and continue where you left off
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">
              Enrolled Courses
            </CardTitle>
            <div className="p-2 bg-blue-100 rounded-lg">
              <BookOpen className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">2</div>
            <p className="text-xs text-gray-500 mt-1">Active courses</p>
            <div className="mt-3 flex items-center gap-1 text-xs text-green-600">
              <TrendingUp className="w-3 h-3" />
              <span>On track</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">
              Pending Assignments
            </CardTitle>
            <div className="p-2 bg-orange-100 rounded-lg">
              <FileText className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">1</div>
            <p className="text-xs text-gray-500 mt-1">Due in 3 days</p>
            <div className="mt-3 flex items-center gap-1 text-xs text-orange-600">
              <Clock className="w-3 h-3" />
              <span>Action needed</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">
              Certificates
            </CardTitle>
            <div className="p-2 bg-green-100 rounded-lg">
              <Award className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">1</div>
            <p className="text-xs text-gray-500 mt-1">Earned</p>
            <div className="mt-3 flex items-center gap-1 text-xs text-green-600">
              <CheckCircle2 className="w-3 h-3" />
              <span>Completed</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Continue Learning Section */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Continue Learning</CardTitle>
          <CardDescription>Your active courses with progress</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Course 1 */}
          <div className="p-4 border border-gray-100 rounded-lg hover:border-blue-200 hover:bg-blue-50/30 transition-all">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-semibold text-gray-900">
                  Introduction to Commerce
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Module 3 of 5 • Last accessed 2 hours ago
                </p>
              </div>
              <Badge variant="outline" className="bg-blue-50">
                In Progress
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Progress</span>
                <span className="font-medium text-gray-900">45%</span>
              </div>
              <Progress value={45} className="h-2" />
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="mt-3 text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-0"
              onClick={() => navigate("/course/1")}
            >
              Continue Learning
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {/* Course 2 */}
          <div className="p-4 border border-gray-100 rounded-lg hover:border-blue-200 hover:bg-blue-50/30 transition-all">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-semibold text-gray-900">
                  Business Economics
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Module 4 of 5 • Last accessed 1 day ago
                </p>
              </div>
              <Badge variant="outline" className="bg-blue-50">
                In Progress
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Progress</span>
                <span className="font-medium text-gray-900">60%</span>
              </div>
              <Progress value={60} className="h-2" />
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="mt-3 text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-0"
              onClick={() => navigate("/course/2")}
            >
              Continue Learning
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions and Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start bg-transparent hover:bg-gray-50"
              onClick={() => navigate("/student/courses")}
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Browse All Courses
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start bg-transparent hover:bg-gray-50"
              onClick={() => navigate("/student/assignments")}
            >
              <FileText className="w-4 h-4 mr-2" />
              View Assignments
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start bg-transparent hover:bg-gray-50"
              onClick={() => navigate("/student/certificates")}
            >
              <Award className="w-4 h-4 mr-2" />
              My Certificates
            </Button>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
            <CardDescription>Your latest updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3 pb-3 border-b border-gray-100">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    Submitted: Case Study Analysis
                  </p>
                  <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3 pb-3 border-b border-gray-100">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    Graded: Midterm Exam (85%)
                  </p>
                  <p className="text-xs text-gray-500 mt-1">1 day ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    Enrolled: Business Economics
                  </p>
                  <p className="text-xs text-gray-500 mt-1">3 days ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
