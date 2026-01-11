"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../../lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar, CheckCircle, Clock, Loader2 } from "lucide-react";

interface Assignment {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  status: "pending" | "submitted" | "graded";
  grade?: number;
}

export default function StudentAssignments() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const data = await apiRequest("/student/assignments");
      setAssignments(data.assignments || []);
    } catch (err) {
      console.error("Failed to fetch assignments", err);
      setError("Failed to load assignments");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: Assignment["status"]) => {
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

  const getStatusBadge = (status: Assignment["status"]) => {
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

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-12 text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Assignments</h1>
        <p className="text-gray-600 mt-2">
          Track your assignments and submissions
        </p>
      </div>

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
        <div className="space-y-3">
          {assignments.map((assignment) => (
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
                        Due {new Date(assignment.dueDate).toLocaleDateString()}
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
                      <Button
                        size="sm"
                        onClick={() =>
                          navigate(`/student/assignments/${assignment.id}`)
                        }
                      >
                        Submit
                      </Button>
                    )}
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
