"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, User, Calendar, CheckCircle } from "lucide-react";

interface Submission {
  id: string;
  studentName: string;
  assignmentTitle: string;
  submittedDate: string;
  status: "pending" | "graded";
  grade?: number;
}

export default function TeacherAssignments() {
  const [submissions, setSubmissions] = useState<Submission[]>([
    {
      id: "1",
      studentName: "Raj Kumar",
      assignmentTitle: "Chapter 1 Quiz",
      submittedDate: "2024-11-10",
      status: "pending",
    },
    {
      id: "2",
      studentName: "Priya Singh",
      assignmentTitle: "Case Study Analysis",
      submittedDate: "2024-11-09",
      status: "pending",
    },
    {
      id: "3",
      studentName: "Amit Patel",
      assignmentTitle: "Chapter 1 Quiz",
      submittedDate: "2024-11-08",
      status: "graded",
      grade: 92,
    },
  ]);

  const handleGrade = (id: string) => {
    setSubmissions(
      submissions.map((sub) =>
        sub.id === id ? { ...sub, status: "graded", grade: 85 } : sub
      )
    );
  };

  const pendingCount = submissions.filter((s) => s.status === "pending").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Student Submissions
        </h1>
        <p className="text-gray-600 mt-2">
          Review and grade student assignments
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
          <Badge variant="destructive">{pendingCount}</Badge>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingCount}</div>
          <p className="text-xs text-gray-600">Submissions awaiting grading</p>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {submissions.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No submissions yet</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          submissions.map((submission) => (
            <Card key={submission.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <h3 className="font-semibold text-gray-900">
                        {submission.studentName}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {submission.assignmentTitle}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Submitted:{" "}
                        {new Date(
                          submission.submittedDate
                        ).toLocaleDateString()}
                      </div>
                      {submission.grade !== undefined && (
                        <div className="font-medium text-green-600">
                          Grade: {submission.grade}%
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {submission.status === "pending" ? (
                      <>
                        <Badge variant="outline">Pending</Badge>
                        <Button
                          size="sm"
                          onClick={() => handleGrade(submission.id)}
                          className="gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Grade
                        </Button>
                      </>
                    ) : (
                      <Badge>Graded</Badge>
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
