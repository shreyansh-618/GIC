"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "../../../lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, User, Calendar, CheckCircle, Loader2 } from "lucide-react";

interface Submission {
  id: string;
  studentName: string;
  assignmentTitle: string;
  submittedAt: string;
  status: "pending" | "graded";
  grade?: number;
}

export default function TeacherAssignments() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [gradingId, setGradingId] = useState<string | null>(null);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const data = await apiRequest("/teacher/assignments");
      setSubmissions(data.submissions || []);
    } catch (err) {
      console.error("Failed to fetch submissions", err);
    } finally {
      setLoading(false);
    }
  };

  const gradeSubmission = async (submissionId: string) => {
    setGradingId(submissionId);
    try {
      await apiRequest(`/teacher/assignments/${submissionId}/grade`, {
        method: "POST",
        body: JSON.stringify({ grade: 85 }),
      });
      await fetchSubmissions();
    } catch (err) {
      console.error("Failed to grade submission", err);
    } finally {
      setGradingId(null);
    }
  };

  const pendingCount = submissions.filter((s) => s.status === "pending").length;

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
        <h1 className="text-3xl font-bold text-gray-900">
          Student Submissions
        </h1>
        <p className="text-gray-600 mt-2">
          Review and grade student assignments
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
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
            <CardContent className="pt-6 text-center py-12">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No submissions yet</p>
            </CardContent>
          </Card>
        ) : (
          submissions.map((sub) => (
            <Card key={sub.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <h3 className="font-semibold text-gray-900">
                        {sub.studentName}
                      </h3>
                    </div>

                    <p className="text-sm text-gray-600 mb-3">
                      {sub.assignmentTitle}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Submitted{" "}
                        {new Date(sub.submittedAt).toLocaleDateString()}
                      </div>

                      {sub.grade !== undefined && (
                        <span className="font-medium text-green-600">
                          Grade: {sub.grade}%
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    {sub.status === "pending" ? (
                      <>
                        <Badge variant="outline">Pending</Badge>
                        <Button
                          size="sm"
                          onClick={() => gradeSubmission(sub.id)}
                          disabled={gradingId === sub.id}
                          className="gap-2"
                        >
                          {gradingId === sub.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <CheckCircle className="w-4 h-4" />
                          )}
                          Grade
                        </Button>
                      </>
                    ) : (
                      <Badge className="bg-green-600">Graded</Badge>
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
