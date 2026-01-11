export type AuthUser = {
  id: string;
  role: "student" | "teacher" | "admin";
};

export type Variables = {
  user: AuthUser;
};
