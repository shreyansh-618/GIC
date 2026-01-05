"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Trash2, Eye } from "lucide-react";

interface Course {
  id: string;
  title: string;
  instructor: string;
  students: number;
  status: "published" | "draft";
  createdDate: string;
}

export default function AdminCourses() {
  const [searchQuery, setSearchQuery] = useState("");
  const [courses, setCourses] = useState<Course[]>([
    {
      id: "1",
      title: "Introduction to Commerce",
      instructor: "Dr. Gupta",
      students: 12,
      status: "published",
      createdDate: "2024-09-15",
    },
    {
      id: "2",
      title: "Business Economics",
      instructor: "Prof. Sharma",
      students: 12,
      status: "published",
      createdDate: "2024-09-20",
    },
    {
      id: "3",
      title: "Advanced Accounting",
      instructor: "Dr. Verma",
      students: 0,
      status: "draft",
      createdDate: "2024-11-01",
    },
  ]);

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: string) => {
    setCourses(courses.filter((course) => course.id !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Manage Courses</h1>
        <p className="text-gray-600 mt-2">
          View and manage all courses on the platform
        </p>
      </div>

      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="space-y-3">
        {filteredCourses.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <p className="text-gray-600">No courses found</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredCourses.map((course) => (
            <Card key={course.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Instructor: {course.instructor}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <Badge
                        variant={
                          course.status === "published"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {course.status === "published" ? "Published" : "Draft"}
                      </Badge>
                      <span className="text-xs text-gray-600">
                        {course.students} students enrolled
                      </span>
                      <span className="text-xs text-gray-600">
                        Created:{" "}
                        {new Date(course.createdDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 bg-transparent"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 text-red-600 hover:text-red-700 bg-transparent"
                      onClick={() => handleDelete(course.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
