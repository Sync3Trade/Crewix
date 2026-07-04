function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  return "Unknown error";
}

export function logApiError(context: string, error: unknown) {
  console.error(`${context}:`, error);
}

export function getApiErrorResponse(error: unknown, fallback: string) {
  const message = getErrorMessage(error);
  const exposeDetails =
    process.env.NODE_ENV !== "production" ||
    process.env.EXPOSE_API_ERRORS === "true";

  return {
    message: exposeDetails ? message : fallback,
    details: exposeDetails ? message : undefined,
  };
}
