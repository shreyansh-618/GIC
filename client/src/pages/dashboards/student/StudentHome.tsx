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
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  FileText,
  Award,
  ArrowRight,
  Clock,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DashboardData {
  stats: {
    courses: number;
    pendingAssignments: number;
    certificates: number;
  };
  courses: {
    id: string;
    title: string;
    progress: number;
    lastAccessed: string;
  }[];
  activity: {
    message: string;
    time: string;
    type: "success" | "info";
  }[];
}

export default function StudentHome() {
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await apiRequest("/student/dashboard");
      setData(res);
    } catch (err) {
      console.error("Failed to load dashboard", err);
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

  if (!data) return null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">My Learning Journey</h1>
        <p className="text-gray-600">
          Track your progress and continue learning
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Enrolled Courses"
          value={data.stats.courses}
          icon={<BookOpen />}
        />
        <StatCard
          title="Pending Assignments"
          value={data.stats.pendingAssignments}
          icon={<FileText />}
        />
        <StatCard
          title="Certificates"
          value={data.stats.certificates}
          icon={<Award />}
        />
      </div>

      {/* Courses */}
      <Card>
        <CardHeader>
          <CardTitle>Continue Learning</CardTitle>
          <CardDescription>Your active courses</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.courses.map((course) => (
            <div key={course.id} className="p-4 border rounded-lg">
              <div className="flex justify-between mb-2">
                <div>
                  <p className="font-semibold">{course.title}</p>
                  <p className="text-sm text-gray-600">
                    Last accessed{" "}
                    {new Date(course.lastAccessed).toLocaleDateString()}
                  </p>
                </div>
                <Badge variant="outline">In Progress</Badge>
              </div>
              <Progress value={course.progress} />
              <Button
                variant="ghost"
                size="sm"
                className="mt-2 p-0"
                onClick={() => navigate(`/course/${course.id}`)}
              >
                Continue <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.activity.map((a, i) => (
            <div key={i} className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-gray-400 mt-1" />
              <div>
                <p className="text-sm font-medium">{a.message}</p>
                <p className="text-xs text-gray-500">{a.time}</p>
              </div>
            </div>
          ))}
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
    <Card>
      <CardHeader className="flex justify-between pb-2">
        <CardTitle className="text-sm">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}
