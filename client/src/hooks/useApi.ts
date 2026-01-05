"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";

interface ApiOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
}

async function apiCall(endpoint: string, options: ApiOptions = {}) {
  const { method = "GET", body, headers = {} } = options;

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}

// Courses API
export function useCourses() {
  return useQuery({
    queryKey: ["courses"],
    queryFn: () => apiCall("/courses"),
  });
}

export function useCourse(courseId: string) {
  return useQuery({
    queryKey: ["course", courseId],
    queryFn: () => apiCall(`/courses/${courseId}`),
    enabled: !!courseId,
  });
}

export function useCreateCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: unknown) =>
      apiCall("/courses", { method: "POST", body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
}

// Users API
export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => apiCall("/users"),
  });
}

export function useUser(userId: string) {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => apiCall(`/users/${userId}`),
    enabled: !!userId,
  });
}

// Assignments API
export function useAssignments() {
  return useQuery({
    queryKey: ["assignments"],
    queryFn: () => apiCall("/assignments"),
  });
}

export function useSubmitAssignment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: unknown) =>
      apiCall("/assignments/submit", { method: "POST", body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignments"] });
    },
  });
}

// Access Requests API
export function useAccessRequests() {
  return useQuery({
    queryKey: ["accessRequests"],
    queryFn: () => apiCall("/access-requests"),
  });
}

export function useApproveRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (requestId: string) =>
      apiCall(`/access-requests/${requestId}/approve`, { method: "PUT" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accessRequests"] });
    },
  });
}

export function useRejectRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (requestId: string) =>
      apiCall(`/access-requests/${requestId}/reject`, { method: "PUT" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accessRequests"] });
    },
  });
}

// Certificates API
export function useCertificates() {
  return useQuery({
    queryKey: ["certificates"],
    queryFn: () => apiCall("/certificates"),
  });
}
