export const API_BASE_URL =
  process.env.VITE_API_BASE_URL || "http://localhost:3001/api";

export const ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",
  STUDENT: "/student",
  TEACHER: "/teacher",
  ADMIN: "/admin",
} as const;

export const ROLE_LABELS = {
  student: "Student",
  teacher: "Teacher",
  admin: "Administrator",
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;
