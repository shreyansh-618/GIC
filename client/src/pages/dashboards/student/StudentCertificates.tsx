"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "../../../lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, Download, Loader2 } from "lucide-react";

interface Certificate {
  id: string;
  courseName: string;
  issuedDate: string;
  certificateNumber: string;
  downloadUrl: string;
}

export default function StudentCertificates() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const data = await apiRequest("/student/certificates");
      setCertificates(data.certificates || []);
    } catch (err) {
      console.error("Failed to fetch certificates", err);
      setError("Failed to load certificates");
    } finally {
      setLoading(false);
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
        <h1 className="text-3xl font-bold text-gray-900">Certificates</h1>
        <p className="text-gray-600 mt-2">
          Your earned certificates and achievements
        </p>
      </div>

      {certificates.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Award className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No certificates earned yet</p>
              <p className="text-sm text-gray-500 mt-2">
                Complete courses to earn certificates
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {certificates.map((cert) => (
            <Card
              key={cert.id}
              className="border-2 border-yellow-200 bg-yellow-50"
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-600" />
                  {cert.courseName}
                </CardTitle>
                <CardDescription>
                  Certificate #{cert.certificateNumber}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Issued on</p>
                  <p className="font-medium">
                    {new Date(cert.issuedDate).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  className="w-full gap-2"
                  onClick={() => window.open(cert.downloadUrl, "_blank")}
                >
                  <Download className="w-4 h-4" />
                  Download Certificate
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
