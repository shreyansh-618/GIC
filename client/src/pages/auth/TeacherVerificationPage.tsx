"use client";

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export default function TeacherVerificationPage() {
  const [accessCode, setAccessCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { user, verifyTeacherCode } = useAuth();
  const navigate = useNavigate();

  /**
   * Redirect logic must live in useEffect (NOT during render)
   */
  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }

    if (user.role !== "teacher") {
      navigate("/login", { replace: true });
      return;
    }

    if (user.isVerified) {
      navigate("/teacher", { replace: true });
    }
  }, [user, navigate]);

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!accessCode.trim()) {
      setError("Please enter your access code");
      return;
    }

    setLoading(true);
    try {
      await verifyTeacherCode(accessCode);
      setSuccess("Access code verified successfully!");
      setTimeout(() => navigate("/teacher"), 1500);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Invalid access code. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== "teacher" || user.isVerified) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl">Verify Your Access</CardTitle>
          <CardDescription>
            Enter the access code provided by the admin
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleVerification} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="w-4 h-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  {success}
                </AlertDescription>
              </Alert>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
              <p className="text-sm font-medium text-blue-900">
                Logged in as {user.email}
              </p>
              <p className="text-sm text-blue-800">
                Your teacher account is pending approval. Once approved, you
                will receive an access code from the admin.
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="accessCode" className="text-sm font-medium">
                Access Code
              </label>
              <Input
                id="accessCode"
                type="text"
                placeholder="Enter your access code"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value.trim())}
                required
                disabled={loading}
                className="text-center text-lg tracking-widest"
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify Access Code"
              )}
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="w-full text-sm"
              onClick={() => navigate("/login")}
              disabled={loading}
            >
              Back to Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
