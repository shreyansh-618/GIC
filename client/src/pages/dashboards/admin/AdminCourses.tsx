"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "../../../lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Trash2, Eye, Loader2 } from "lucide-react";

interface Course {
  id: string;
  title: string;
  teacherName: string;
  students: number;
  status: "published" | "draft";
  createdAt: string;
}

export default function AdminCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const data = await apiRequest("/admin/courses");
      setCourses(data.courses || []);
    } catch (err) {
      console.error("Failed to fetch courses", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (courseId: string) => {
    if (!confirm("Are you sure you want to delete this course?")) return;

    setActionLoading(courseId);
    try {
      await apiRequest(`/admin/courses/${courseId}`, {
        method: "DELETE",
      });
      setCourses((prev) => prev.filter((c) => c.id !== courseId));
    } catch (err) {
      console.error("Delete failed", err);
    } finally {
      setActionLoading(null);
    }
  };

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Manage Courses</h1>
        <p className="text-gray-600 mt-1">
          View and manage all courses on the platform
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
        <Input
          className="pl-10"
          placeholder="Search courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filteredCourses.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-gray-500">
            No courses found
          </CardContent>
        </Card>
      ) : (
        filteredCourses.map((course) => (
          <Card key={course.id}>
            <CardContent className="pt-6 flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{course.title}</h3>
                <p className="text-sm text-gray-600">
                  Instructor: {course.teacherName}
                </p>
                <div className="flex gap-2 mt-2">
                  <Badge
                    variant={
                      course.status === "published" ? "default" : "secondary"
                    }
                  >
                    {course.status}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {course.students} students
                  </span>
                  <span className="text-xs text-gray-500">
                    Created {new Date(course.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="bg-transparent">
                  <Eye className="w-4 h-4" />
                  View
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 bg-transparent"
                  disabled={actionLoading === course.id}
                  onClick={() => handleDelete(course.id)}
                >
                  {actionLoading === course.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
