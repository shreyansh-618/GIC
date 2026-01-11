import React, { createContext, useContext, useEffect, useState } from "react";
import { apiRequest } from "../lib/api";

export type UserRole = "student" | "teacher" | "admin";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: "active" | "pending" | "inactive";
  isVerified: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    role: UserRole,
    extra?: {
      fullName?: string;
      teacherId?: string;
    }
  ) => Promise<void>;
  verifyTeacherCode: (code: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * Restore auth state from localStorage on app load
   */
  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (token && storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        localStorage.clear();
      }
    } catch {
      localStorage.clear();
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Login
   */
  const login = async (email: string, password: string) => {
    const data = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (!data?.token || !data?.user) {
      throw new Error("Invalid login response");
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
  };

  /**
   * Register
   */
  const register = async (
    email: string,
    password: string,
    role: UserRole,
    extra?: {
      fullName?: string;
      teacherId?: string;
    }
  ) => {
    await apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
        role,
        name: extra?.fullName,
        teacherId: extra?.teacherId,
      }),
    });
  };

  /**
   * Teacher verification (access code)
   */
  const verifyTeacherCode = async (code: string) => {
    const data = await apiRequest("/teachers/verify-code", {
      method: "POST",
      body: JSON.stringify({ code }),
    });

    if (!data?.user) {
      throw new Error("Verification failed");
    }

    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
  };

  /**
   * Logout
   */
  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        verifyTeacherCode,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}
