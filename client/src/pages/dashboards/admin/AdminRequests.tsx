"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, XCircle, Clock } from "lucide-react";

interface PendingTeacher {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export default function AdminRequests() {
  const [teachers, setTeachers] = useState<PendingTeacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPendingTeachers();
  }, []);

  const fetchPendingTeachers = async () => {
    try {
      setError(null);
      const data = await apiRequest("/admin/pending-teachers");
      setTeachers(data.teachers || []);
    } catch (err: any) {
      setError(err.message || "Failed to load pending teachers");
    } finally {
      setLoading(false);
    }
  };

  const approveTeacher = async (teacherId: string) => {
    setActionLoading(teacherId);
    try {
      await apiRequest(`/admin/approve-teacher/${teacherId}`, {
        method: "POST",
      });
      fetchPendingTeachers();
    } catch (err: any) {
      alert(err.message || "Failed to approve teacher");
    } finally {
      setActionLoading(null);
    }
  };

  const rejectTeacher = async (teacherId: string) => {
    setActionLoading(teacherId);
    try {
      await apiRequest(`/admin/reject-teacher/${teacherId}`, {
        method: "POST",
      });
      fetchPendingTeachers();
    } catch (err: any) {
      alert(err.message || "Failed to reject teacher");
    } finally {
      setActionLoading(null);
    }
  };

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
        <h1 className="text-3xl font-bold">Teacher Approval Requests</h1>
        <p className="text-gray-600 mt-1">
          Review and approve teacher registrations
        </p>
      </div>

      {error && (
        <Card>
          <CardContent className="py-6 text-red-600 text-center">
            {error}
          </CardContent>
        </Card>
      )}

      {teachers.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-gray-500">
            No pending requests
          </CardContent>
        </Card>
      ) : (
        teachers.map((t) => (
          <Card key={t.id}>
            <CardContent className="pt-6 flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-500" />
                  <h3 className="font-semibold">{t.name}</h3>
                </div>
                <p className="text-sm text-gray-600">{t.email}</p>
                <p className="text-xs text-gray-500">
                  Requested on {new Date(t.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => approveTeacher(t.id)}
                  disabled={actionLoading === t.id}
                >
                  {actionLoading === t.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4 mr-1" />
                  )}
                  Approve
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => rejectTeacher(t.id)}
                  disabled={actionLoading === t.id}
                  className="text-red-600 bg-transparent"
                >
                  <XCircle className="w-4 h-4 mr-1" />
                  Reject
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
