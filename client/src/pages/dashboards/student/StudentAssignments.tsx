"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar, CheckCircle, Clock } from "lucide-react";

interface Assignment {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  status: "pending" | "submitted" | "graded";
  grade?: number;
}

export default function StudentAssignments() {
  const [assignments] = useState<Assignment[]>([
    {
      id: "1",
      title: "Chapter 1 Quiz",
      course: "Introduction to Commerce",
      dueDate: "2024-11-15",
      status: "pending",
    },
    {
      id: "2",
      title: "Case Study Analysis",
      course: "Business Economics",
      dueDate: "2024-11-10",
      status: "submitted",
    },
    {
      id: "3",
      title: "Midterm Exam",
      course: "Introduction to Commerce",
      dueDate: "2024-10-20",
      status: "graded",
      grade: 85,
    },
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 text-orange-600" />;
      case "submitted":
        return <FileText className="w-4 h-4 text-blue-600" />;
      case "graded":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline">Pending</Badge>;
      case "submitted":
        return <Badge variant="secondary">Submitted</Badge>;
      case "graded":
        return <Badge>Graded</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Assignments</h1>
        <p className="text-gray-600 mt-2">
          Track your assignments and submissions
        </p>
      </div>

      <div className="space-y-3">
        {assignments.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No assignments yet</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          assignments.map((assignment) => (
            <Card key={assignment.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusIcon(assignment.status)}
                      <h3 className="font-semibold text-gray-900">
                        {assignment.title}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {assignment.course}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Due: {new Date(assignment.dueDate).toLocaleDateString()}
                      </div>
                      {assignment.grade !== undefined && (
                        <div className="font-medium text-green-600">
                          Grade: {assignment.grade}%
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {getStatusBadge(assignment.status)}
                    {assignment.status === "pending" && (
                      <Button size="sm">Submit</Button>
                    )}
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
