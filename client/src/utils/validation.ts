export const validateEmail = (email: string): boolean => {
  const trimmed = email.trim().toLowerCase();

  const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9-]+\.[a-z]{2,}$/i;

  return emailRegex.test(trimmed);
};

export const validatePassword = (
  password: string
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }

  if (/\s/.test(password)) {
    errors.push("Password must not contain spaces");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

export const validateOTP = (otp: string): boolean => {
  const cleaned = otp.trim();
  return /^[0-9]{6}$/.test(cleaned);
};
