// errorHandler.ts - Enhanced version with proper TypeScript types
import { toast } from "sonner";
import  type {UseFormReturn, FieldValues } from "react-hook-form";
import { AxiosError } from "axios";

// Types for error responses
interface ValidationErrorData {
  errors?: Record<string, string | string[]>;
  message?: string;
}

interface ApiErrorData {
  message?: string;
  errors?: Record<string, string | string[]>;
  [key: string]: any;
}

interface ErrorHandlerOptions {
  showToast?: boolean;
  logError?: boolean;
}

interface ErrorResult {
  type:
    | "validation"
    | "network"
    | "forbidden"
    | "not-found"
    | "server"
    | "unknown";
  message: string;
}

/**
 * Handle validation errors (400/422 status codes)
 */
function handleValidationError(
  errorData: ValidationErrorData,
  form: UseFormReturn<FieldValues> | null,
  showToast: boolean,
): ErrorResult {
  // Handle field-specific validation errors
  if (errorData?.errors && form) {
    Object.entries(errorData.errors).forEach(([field, messages]) => {
      form.setError(field, {
        type: "server",
        message: Array.isArray(messages) ? messages[0] : messages,
      });
    });

    // Optionally show a generic toast for validation errors
    // if (showToast) {
    //   toast.error("Please check the form for errors.");
    // }
  }
  // else {
  //   // Generic validation error
  //   const message = errorData?.message || "Invalid data provided.";
  //   if (showToast) toast.error(message);
  // }

  return { type: "validation", message: "Validation failed" };
}

/**
 * Global API error handler for form submissions and API calls
 */
export function handleApiError(
  err: AxiosError<ApiErrorData> | Error,
  form: UseFormReturn<FieldValues> | null = null,
  options: ErrorHandlerOptions = {},
): ErrorResult {
  const { showToast = true, logError = true } = options;

  if (logError) {
    console.group("🚨 API Error");
    console.error("Message:", err.message);

    if ("response" in err) {
      console.error("Status:", err.response?.status);
      console.error("URL:", err.config?.url);
    }

    console.error("Full Error:", err);
    console.groupEnd();
  }

  // Network error (server down, no internet)
  if (!("response" in err) || !err.response) {
    if (showToast) {
      toast.error(
        "Cannot connect to the server. Please check your internet connection.",
      );
    }
    return {
      type: "network",
      message: "Network error occurred",
    };
  }

  const { status, data } = err.response;

  // Handle different status codes
  switch (status) {
    case 400:
    case 401: // still allows you to NOT show a toast if you need, just add a flag if needed
    case 422:
      return handleValidationError(data, form, showToast);

    case 403:
      if (showToast)
        toast.error("You don't have permission to perform this action.");
      return { type: "forbidden", message: "Access denied" };

    case 404:
      if (showToast) toast.error("The requested resource was not found.");
      return { type: "not-found", message: "Resource not found" };

    case 500:
      if (showToast) toast.error("Server error. Our team has been notified.");
      return { type: "server", message: "Internal server error" };

    default:
      const message = data?.message || "An unexpected error occurred.";
      if (showToast) toast.error(message);
      return { type: "unknown", message };
  }
}

/**
 * Handle OAuth/redirect errors
 */
export function handleRedirectError(errorCode?: string): void {
  if (!errorCode) return;

  const errorMessages: Record<string, string> = {
    auth_failed: "Authentication failed. Please try again.",
    email_exists: "An account with that email already exists.",
    access_denied: "Access was denied. Please try again.",
    invalid_request: "Invalid authentication request.",
    server_error: "Authentication server error. Please try again later.",
  };

  const message =
    errorMessages[errorCode] || "An unknown authentication error occurred.";

  toast.error(message, {
    id: "auth-error-toast",
    duration: 5000,
  });
}

/**
 * Specialized handler for query errors (TanStack Query)
 */
export function handleQueryError(
  error: AxiosError<ApiErrorData> | Error,
  queryKey: string,
): void {
  console.error(`Query error for ${queryKey}:`, error);

  // Don't show toast for auth errors - interceptor handles
  if ("response" in error && error?.response?.status === 401) {
    return;
  }

  // Handle based on error type
  if (!("response" in error) || !error.response) {
    toast.error("Connection problem. Data may be outdated.");
  } else if (error.response.status >= 500) {
    toast.error("Server issue loading data. Please refresh.");
  }
  // For other errors, let component handle them
}

// Export types for use in other files
export type {
  ErrorResult,
  ErrorHandlerOptions,
  ApiErrorData,
  ValidationErrorData,
};
