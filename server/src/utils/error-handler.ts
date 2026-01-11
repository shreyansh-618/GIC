export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode = 500,
    public details?: unknown
  ) {
    super(message);
    this.name = "AppError";
  }
}

export const handleApiError = (error: unknown): string => {
  if (error instanceof AppError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  return "An unexpected error occurred. Please try again.";
};

export const logError = (error: unknown, context?: string): void => {
  if (process.env.NODE_ENV === "development") {
    console.error(`[Error${context ? ` - ${context}` : ""}]`, error);
  }
};
