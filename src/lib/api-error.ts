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

  return {
    message,
    details: message,
  };
}
