"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error(
    "VITE_API_BASE_URL is not defined. Check your frontend .env file."
  );
}

interface ApiOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
}

async function apiCall(endpoint: string, options: ApiOptions = {}) {
  const { method = "GET", body, headers = {} } = options;

  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : {};

  if (!response.ok) {
    throw new Error(data.error || data.message || "API request failed");
  }

  return data;
}

/* ===================== COURSES ===================== */

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

/* ===================== USERS ===================== */

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

/* ===================== ASSIGNMENTS ===================== */

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

/* ===================== ADMIN / TEACHER ===================== */

export function usePendingTeachers() {
  return useQuery({
    queryKey: ["pending-teachers"],
    queryFn: () => apiCall("/admin/pending-teachers"),
  });
}

export function useApproveTeacher() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (teacherId: string) =>
      apiCall(`/admin/approve-teacher/${teacherId}`, {
        method: "POST",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-teachers"] });
    },
  });
}

export function useRejectTeacher() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (teacherId: string) =>
      apiCall(`/admin/reject-teacher/${teacherId}`, {
        method: "POST",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-teachers"] });
    },
  });
}
