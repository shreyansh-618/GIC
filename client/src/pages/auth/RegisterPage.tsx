"use client";

import type React from "react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
import { Loader2, CheckCircle2, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type RegistrationStep =
  | "role-selection"
  | "account-details"
  | "teacher-details";

export default function RegisterPage() {
  const [step, setStep] = useState<RegistrationStep>("role-selection");
  const [selectedRole, setSelectedRole] = useState<
    "student" | "teacher" | null
  >(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRoleSelection = (role: "student" | "teacher") => {
    setSelectedRole(role);
    setError(null);
    setSuccess(null);
    setStep("account-details");
  };

  const handleAccountDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (selectedRole === "teacher") {
      setStep("teacher-details");
    } else {
      setLoading(true);
      try {
        await register(email, password, selectedRole || "student", {
          fullName,
        });
        setSuccess("Account created successfully! Redirecting...");
        setTimeout(() => navigate("/student"), 1500);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Registration failed");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleTeacherDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) {
      setError("Full name is required");
      return;
    }

    if (!teacherId.trim()) {
      setError("Teacher ID is required");
      return;
    }

    setLoading(true);
    try {
      await register(email, password, "teacher", { fullName, teacherId });
      setSuccess(
        "Registration submitted! Awaiting admin approval. You will receive an access code via email."
      );
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        {step === "role-selection" && (
          <>
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl">Join Gupta Institute</CardTitle>
              <CardDescription>Choose your role to get started</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleRoleSelection("student")}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedRole === "student"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <div className="text-2xl mb-2">👨‍🎓</div>
                  <div className="font-semibold text-sm">Student</div>
                  <div className="text-xs text-gray-600 mt-1">Learn & grow</div>
                </button>

                <button
                  onClick={() => handleRoleSelection("teacher")}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedRole === "teacher"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <div className="text-2xl mb-2">👨‍🏫</div>
                  <div className="font-semibold text-sm">Teacher</div>
                  <div className="text-xs text-gray-600 mt-1">
                    Share knowledge
                  </div>
                </button>
              </div>

              {selectedRole && (
                <Button
                  onClick={() => setStep("account-details")}
                  className="w-full"
                >
                  Continue as{" "}
                  {selectedRole === "student" ? "Student" : "Teacher"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </CardContent>
          </>
        )}

        {step === "account-details" && (
          <>
            <CardHeader className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {selectedRole === "student" ? "👨‍🎓 Student" : "👨‍🏫 Teacher"}
                </Badge>
              </div>
              <CardTitle className="text-2xl">Create Account</CardTitle>
              <CardDescription>Set up your credentials</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAccountDetails} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium"
                  >
                    Confirm Password
                  </label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => {
                      setStep("role-selection");
                      setSelectedRole(null);
                    }}
                    disabled={loading}
                  >
                    Back
                  </Button>
                  <Button type="submit" className="flex-1" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Next"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </>
        )}

        {step === "teacher-details" && (
          <>
            <CardHeader className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline">👨‍🏫 Teacher</Badge>
              </div>
              <CardTitle className="text-2xl">Teacher Information</CardTitle>
              <CardDescription>
                Provide your professional details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleTeacherDetails} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
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

                <div className="space-y-2">
                  <label htmlFor="fullName" className="text-sm font-medium">
                    Full Name
                  </label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="teacherId" className="text-sm font-medium">
                    Teacher ID
                  </label>
                  <Input
                    id="teacherId"
                    type="text"
                    placeholder="T12345"
                    value={teacherId}
                    onChange={(e) => setTeacherId(e.target.value)}
                    required
                    disabled={loading}
                  />
                  <p className="text-xs text-gray-500">
                    Your institutional teacher ID
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-900">
                    Your account will be pending admin approval. You'll receive
                    an access code via email once approved.
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => setStep("account-details")}
                    disabled={loading}
                  >
                    Back
                  </Button>
                  <Button type="submit" className="flex-1" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit for Approval"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </>
        )}

        {step !== "role-selection" && (
          <div className="px-6 py-4 border-t text-center text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:underline font-medium"
            >
              Sign in here
            </Link>
          </div>
        )}
      </Card>
    </div>
  );
}
