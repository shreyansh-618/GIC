"use client";

import { useParams, useNavigate } from "react-router-dom";
import { useCourse } from "../hooks/useApi";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Loader2, ArrowLeft } from "lucide-react";

export default function CourseDetailsPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  if (!courseId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Invalid course
      </div>
    );
  }

  const { data: course, isLoading, error } = useCourse(courseId);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen p-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go Back
        </Button>
        <Card>
          <CardContent className="pt-6 text-center text-red-600">
            Failed to load course
          </CardContent>
        </Card>
      </div>
    );
  }

  const getYouTubeEmbedUrl = (url?: string) => {
    if (!url) return null;
    const match = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/
    );
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  const embedUrl = getYouTubeEmbedUrl(course.videoUrl);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go Back
        </Button>

        <div>
          <h1 className="text-3xl font-bold">{course.title}</h1>
          {course.instructor && (
            <p className="text-gray-600 mt-1">
              Instructor: {course.instructor}
            </p>
          )}
        </div>

        {/* Video */}
        <Card>
          <CardHeader>
            <CardTitle>Course Video</CardTitle>
          </CardHeader>
          <CardContent>
            {embedUrl ? (
              <div className="aspect-video rounded-lg overflow-hidden">
                <iframe
                  src={embedUrl}
                  title={course.title}
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            ) : (
              <p className="text-center text-gray-600">Video not available</p>
            )}
          </CardContent>
        </Card>

        {/* Description */}
        <Card>
          <CardHeader>
            <CardTitle>About This Course</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              {course.description || "No description provided"}
            </p>
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Course Notes</CardTitle>
            <CardDescription>Downloadable materials</CardDescription>
          </CardHeader>
          <CardContent>
            {course.notes?.length ? (
              course.notes.map((note: any) => (
                <div
                  key={note.id}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span>{note.title}</span>
                  </div>
                  {note.fileUrl && (
                    <a href={note.fileUrl} target="_blank">
                      <Button size="sm" variant="ghost">
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    </a>
                  )}
                </div>
              ))
            ) : (
              <p className="text-center text-gray-600">No notes available</p>
            )}
          </CardContent>
        </Card>

        {/* Access */}
        <Card>
          <CardHeader>
            <CardTitle>Access Status</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-sm font-medium">
              {course.accessStatus === "granted"
                ? "You have access to this course"
                : "Access pending approval"}
            </span>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
