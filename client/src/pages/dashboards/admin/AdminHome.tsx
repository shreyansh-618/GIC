"use client";

import {
  usePendingTeachers,
  useApproveTeacher,
  useRejectTeacher,
} from "../../../hooks/useApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, XCircle, Mail } from "lucide-react";

export default function AdminRequests() {
  const { data: teachers = [], isLoading } = usePendingTeachers();
  const approveTeacher = useApproveTeacher();
  const rejectTeacher = useRejectTeacher();

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (teachers.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Mail className="w-12 h-12 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-600">No pending teacher requests</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Pending Teacher Requests</h1>

      {teachers.map((t: any) => (
        <Card key={t.id}>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>{t.name}</CardTitle>
            <Badge variant="outline">Pending</Badge>
          </CardHeader>

          <CardContent className="space-y-3">
            <p className="text-sm text-gray-600">{t.email}</p>

            <div className="flex gap-2">
              <Button
                onClick={() => approveTeacher.mutate(t.id)}
                disabled={approveTeacher.isPending}
                className="gap-2"
              >
                {approveTeacher.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle className="w-4 h-4" />
                )}
                Approve
              </Button>

              <Button
                variant="outline"
                onClick={() => rejectTeacher.mutate(t.id)}
                disabled={rejectTeacher.isPending}
                className="gap-2 text-red-600 bg-transparent"
              >
                {rejectTeacher.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <XCircle className="w-4 h-4" />
                )}
                Reject
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
