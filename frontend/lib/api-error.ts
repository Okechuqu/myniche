import axios from "axios";

type ApiErrorBody = {
  code?: unknown;
  detail?: unknown;
  message?: unknown;
  non_field_errors?: unknown;
  [key: string]: unknown;
};

const FALLBACK_BY_STATUS: Record<number, string> = {
  400: "Please check the information you entered and try again.",
  401: "Your sign-in details could not be verified.",
  403: "You do not have permission to perform this action.",
  404: "The requested information could not be found.",
  409: "That information conflicts with an existing record.",
  429: "Too many requests. Please wait a moment and try again.",
};

const CODE_MESSAGES: Record<string, string> = {
  google_consent_required:
    "Create your account first to continue with Google.",
};

const cleanMessage = (value: string) => {
  const message = value.replace(/\s+/g, " ").trim();

  if (!message || message.startsWith("<")) {
    return null;
  }

  return message.charAt(0).toUpperCase() + message.slice(1);
};

const collectMessages = (value: unknown): string[] => {
  if (typeof value === "string") {
    const message = cleanMessage(value);
    return message ? [message] : [];
  }

  if (Array.isArray(value)) {
    return value.flatMap(collectMessages);
  }

  if (value && typeof value === "object") {
    return Object.entries(value as ApiErrorBody)
      .filter(([key]) => key !== "code")
      .flatMap(([, nestedValue]) => collectMessages(nestedValue));
  }

  return [];
};

export const getApiErrorCode = (error: unknown) => {
  if (!axios.isAxiosError(error)) {
    return null;
  }

  const code = (error.response?.data as ApiErrorBody | undefined)?.code;
  return typeof code === "string" ? code : null;
};

export const getApiErrorMessage = (
  error: unknown,
  fallback = "Something went wrong. Please try again.",
) => {
  if (!axios.isAxiosError(error)) {
    return error instanceof Error
      ? cleanMessage(error.message) ?? fallback
      : fallback;
  }

  const code = getApiErrorCode(error);
  if (code && CODE_MESSAGES[code]) {
    return CODE_MESSAGES[code];
  }

  const status = error.response?.status;

  if (!error.response) {
    return "Unable to connect. Check your internet connection and try again.";
  }

  if (status && status >= 500) {
    return "The service is temporarily unavailable. Please try again later.";
  }

  const messages = [...new Set(collectMessages(error.response.data))];
  if (messages.length) {
    return messages.join(" ");
  }

  return (status && FALLBACK_BY_STATUS[status]) || fallback;
};
