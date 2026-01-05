"use client";

import { useState } from "react";
import {
  useAccessRequests,
  useApproveRequest,
  useRejectRequest,
} from "../../../hooks/useApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  Loader2,
  Copy,
  Check,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function AdminRequests() {
  const { data: requests = [], isLoading } = useAccessRequests();
  const approveRequest = useApproveRequest();
  const rejectRequest = useRejectRequest();
  const [showCodeDialog, setShowCodeDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [codeCopied, setCodeCopied] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const pendingRequests = requests.filter((r: any) => r.status === "pending");

  const handleGenerateCode = async (request: any) => {
    setSelectedRequest(request);
    // Generate a random 6-character alphanumeric code
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setGeneratedCode(code);
    setShowCodeDialog(true);
  };

  const handleCopyCode = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    }
  };

  const handleApproveWithCode = async () => {
    if (!selectedRequest || !generatedCode) return;

    try {
      // Call API to approve and store code
      await fetch(`/api/teachers/${selectedRequest.id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accessCode: generatedCode,
          email: selectedRequest.email,
        }),
      });

      approveRequest.mutate(selectedRequest.id);
      setShowCodeDialog(false);
      setGeneratedCode(null);
      setSelectedRequest(null);
    } catch (err) {
      console.error("Error approving request:", err);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 text-orange-600" />;
      case "approved":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline">Pending</Badge>;
      case "approved":
        return <Badge className="bg-green-600">Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Teacher Access Requests
        </h1>
        <p className="text-gray-600 mt-2">
          Review and approve teacher registration requests
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Pending Requests
          </CardTitle>
          <Badge variant="destructive">{pendingRequests.length}</Badge>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingRequests.length}</div>
          <p className="text-xs text-gray-600">Awaiting your approval</p>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {requests.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <Mail className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No requests</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          requests.map((request: any) => (
            <Card key={request.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusIcon(request.status)}
                      <h3 className="font-semibold text-gray-900">
                        {request.fullName || request.name}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {request.email}
                    </p>
                    <div className="flex items-center gap-3 text-sm flex-wrap">
                      {request.teacherId && (
                        <Badge variant="secondary">
                          ID: {request.teacherId}
                        </Badge>
                      )}
                      <span className="text-gray-600">
                        Requested:{" "}
                        {new Date(request.requestDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {getStatusBadge(request.status)}
                    {request.status === "pending" && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleGenerateCode(request)}
                          disabled={approveRequest.isPending}
                          className="gap-2"
                        >
                          {approveRequest.isPending ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <CheckCircle className="w-4 h-4" />
                          )}
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => rejectRequest.mutate(request.id)}
                          disabled={rejectRequest.isPending}
                          className="gap-2 text-red-600 hover:text-red-700 bg-transparent"
                        >
                          {rejectRequest.isPending ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <XCircle className="w-4 h-4" />
                          )}
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={showCodeDialog} onOpenChange={setShowCodeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate Access Code</DialogTitle>
            <DialogDescription>
              Generate and send an access code to{" "}
              {selectedRequest?.fullName || selectedRequest?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-2">Access Code:</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-2xl font-mono font-bold text-blue-600 tracking-widest">
                  {generatedCode}
                </code>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopyCode}
                  className="gap-2 bg-transparent"
                >
                  {codeCopied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-900">
                This code will be sent to {selectedRequest?.email}. The teacher
                will need to enter this code to verify their account.
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowCodeDialog(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button onClick={handleApproveWithCode} className="flex-1">
                Send Code & Approve
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
