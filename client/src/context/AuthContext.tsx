"use client";

import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { auth } from "../config/firebase";

export type UserRole = "student" | "teacher" | "admin";

interface AuthUser extends User {
  role?: UserRole;
  verificationStatus?: "pending" | "verified" | "rejected";
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    role: UserRole,
    additionalData?: Record<string, any>
  ) => Promise<void>;
  logout: () => Promise<void>;
  setUserRole: (role: UserRole) => void;
  verifyTeacherCode: (code: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch user role and verification status from backend
        try {
          const response = await fetch(`/api/users/${firebaseUser.uid}`);
          const userData = await response.json();
          setUser({
            ...firebaseUser,
            role: userData.role || "student",
            verificationStatus: userData.verificationStatus || "verified",
          });
        } catch (err) {
          // Default to student if API fails
          setUser({
            ...firebaseUser,
            role: "student",
            verificationStatus: "verified",
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Login failed";
      setError(errorMessage);
      throw err;
    }
  };

  const register = async (
    email: string,
    password: string,
    role: UserRole = "student",
    additionalData?: Record<string, any>
  ) => {
    try {
      setError(null);
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: result.user.uid,
          email: result.user.email,
          role: role,
          verificationStatus: role === "teacher" ? "pending" : "verified",
          ...additionalData,
        }),
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Registration failed";
      setError(errorMessage);
      throw err;
    }
  };

  const verifyTeacherCode = async (code: string) => {
    try {
      setError(null);
      if (!user) throw new Error("User not found");

      const response = await fetch("/api/teachers/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.uid,
          email: user.email,
          code: code,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Invalid access code");
      }

      // Update user verification status
      setUser({
        ...user,
        verificationStatus: "verified",
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Verification failed";
      setError(errorMessage);
      throw err;
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await signOut(auth);
      setUser(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Logout failed";
      setError(errorMessage);
      throw err;
    }
  };

  const setUserRole = (role: UserRole) => {
    if (user) {
      setUser({ ...user, role });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        setUserRole,
        verifyTeacherCode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
