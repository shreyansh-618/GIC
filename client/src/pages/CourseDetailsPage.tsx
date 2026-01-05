"use client";

import { useParams } from "react-router-dom";
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
import { useNavigate } from "react-router-dom";

export default function CourseDetailsPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { data: course, isLoading, error } = useCourse(courseId || "");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="gap-2 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
          <Card>
            <CardContent className="pt-6">
              <p className="text-red-600 text-center">Failed to load course</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Extract YouTube video ID from URL
  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/
    )?.[1];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  const embedUrl = getYouTubeEmbedUrl(course.videoUrl);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Go Back
        </Button>

        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            {course.title}
          </h1>
          <p className="text-gray-600 mt-2">Instructor: {course.instructor}</p>
        </div>

        {/* Video Section */}
        <Card>
          <CardHeader>
            <CardTitle>Course Video</CardTitle>
          </CardHeader>
          <CardContent>
            {embedUrl ? (
              <div className="bg-gray-200 rounded-lg aspect-video overflow-hidden">
                <iframe
                  width="100%"
                  height="100%"
                  src={embedUrl}
                  title={course.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="bg-gray-200 rounded-lg aspect-video flex items-center justify-center">
                <p className="text-gray-600">Invalid video URL</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Course Description */}
        <Card>
          <CardHeader>
            <CardTitle>About This Course</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              {course.description}
            </p>
          </CardContent>
        </Card>

        {/* Notes Section */}
        <Card>
          <CardHeader>
            <CardTitle>Course Notes</CardTitle>
            <CardDescription>Study materials and resources</CardDescription>
          </CardHeader>
          <CardContent>
            {course.notes && course.notes.length > 0 ? (
              <div className="space-y-3">
                {course.notes.map((note: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <span className="font-medium">{note.title}</span>
                    </div>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-8">
                No notes available yet
              </p>
            )}
          </CardContent>
        </Card>

        {/* Access Status */}
        <Card>
          <CardHeader>
            <CardTitle>Access Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Course Access</span>
              <span className="text-sm font-medium text-green-600">
                You have access to this course
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
