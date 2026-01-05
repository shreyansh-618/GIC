"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, Search, Edit, Trash2, Plus, Users } from "lucide-react";

interface Course {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  students: number;
  createdDate: string;
}

export default function TeacherCourses() {
  const [searchQuery, setSearchQuery] = useState("");
  const [courses, setCourses] = useState<Course[]>([
    {
      id: "1",
      title: "Introduction to Commerce",
      description: "Learn the fundamentals of commerce and business",
      videoUrl: "https://youtube.com/watch?v=example1",
      students: 12,
      createdDate: "2024-09-15",
    },
    {
      id: "2",
      title: "Business Economics",
      description: "Understand economic principles in business",
      videoUrl: "https://youtube.com/watch?v=example2",
      students: 12,
      createdDate: "2024-09-20",
    },
  ]);
  const navigate = useNavigate();

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: string) => {
    setCourses(courses.filter((course) => course.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
          <p className="text-gray-600 mt-2">Manage and create your courses</p>
        </div>
        <Button
          onClick={() => navigate("/teacher/courses/create")}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Course
        </Button>
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

      {filteredCourses.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No courses found</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredCourses.map((course) => (
            <Card key={course.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900">
                      {course.title}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      {course.description}
                    </p>
                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {course.students} students
                      </div>
                      <div>
                        Created:{" "}
                        {new Date(course.createdDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 bg-transparent"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
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
          ))}
        </div>
      )}
    </div>
  );
}
