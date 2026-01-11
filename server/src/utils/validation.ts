import mongoose from "mongoose";

/**
 * Email validation
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Password validation
 */
export const validatePassword = (
  password: string
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (password.length < 6) {
    errors.push("Password must be at least 6 characters");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * OTP / Access code validation
 */
export const validateOTP = (otp: string): boolean => {
  return /^\d{6}$/.test(otp);
};

/**
 * Mongo ObjectId validation
 */
export const isValidObjectId = (id: string): boolean => {
  return mongoose.Types.ObjectId.isValid(id);
};

/**
 * Generic request body validation
 */
type Rule = {
  required?: boolean;
  type?: "string" | "number" | "boolean";
  minLength?: number;
  maxLength?: number;
};

export const validateBody = (
  body: Record<string, any>,
  rules: Record<string, Rule>
): string[] => {
  const errors: string[] = [];

  for (const key in rules) {
    const rule = rules[key];
    const value = body[key];

    if (
      rule.required &&
      (value === undefined || value === null || value === "")
    ) {
      errors.push(`${key} is required`);
      continue;
    }

    if (value !== undefined && rule.type && typeof value !== rule.type) {
      errors.push(`${key} must be a ${rule.type}`);
    }

    if (typeof value === "string") {
      if (rule.minLength && value.length < rule.minLength) {
        errors.push(`${key} must be at least ${rule.minLength} characters`);
      }
      if (rule.maxLength && value.length > rule.maxLength) {
        errors.push(`${key} must be at most ${rule.maxLength} characters`);
      }
    }
  }

  return errors;
};
