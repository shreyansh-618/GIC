"use client";

import type React from "react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ArrowLeft } from "lucide-react";

export default function CreateCourse() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    videoUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.title || !formData.description || !formData.videoUrl) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      navigate("/teacher/courses");
    } catch (err) {
      setError("Failed to create course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/teacher/courses")}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Create New Course</CardTitle>
          <CardDescription>
            Add a YouTube video and course details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Course Title
              </label>
              <Input
                id="title"
                name="title"
                placeholder="e.g., Introduction to Commerce"
                value={formData.title}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Course Description
              </label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe what students will learn..."
                value={formData.description}
                onChange={handleChange}
                required
                disabled={loading}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="videoUrl" className="text-sm font-medium">
                YouTube Video URL
              </label>
              <Input
                id="videoUrl"
                name="videoUrl"
                type="url"
                placeholder="https://youtube.com/watch?v=..."
                value={formData.videoUrl}
                onChange={handleChange}
                required
                disabled={loading}
              />
              <p className="text-xs text-gray-600">
                Paste the full YouTube URL of your course video
              </p>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={loading} className="gap-2">
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Course"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/teacher/courses")}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
