export const MIN_DISPLAY_NAME_LENGTH = 2;
export const MAX_DISPLAY_NAME_LENGTH = 50;
export const MIN_PASSWORD_LENGTH = 12;

export interface SignUpDetails {
  displayName: string;
  password: string;
  passwordConfirmation: string;
}

export interface ValidationResult {
  value: string;
  error: string | null;
}

export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function validateDisplayName(value: string): ValidationResult {
  const normalized = value.trim().replace(/\s+/g, " ");

  if (normalized.length < MIN_DISPLAY_NAME_LENGTH) {
    return {
      value: normalized,
      error: `Use at least ${MIN_DISPLAY_NAME_LENGTH} characters for your name.`,
    };
  }

  if (normalized.length > MAX_DISPLAY_NAME_LENGTH) {
    return {
      value: normalized,
      error: `Use at most ${MAX_DISPLAY_NAME_LENGTH} characters for your name.`,
    };
  }

  return { value: normalized, error: null };
}

export function validateSignUp({
  displayName,
  password,
  passwordConfirmation,
}: SignUpDetails): ValidationResult {
  const nameValidation = validateDisplayName(displayName);

  if (nameValidation.error) return nameValidation;

  if (password.length < MIN_PASSWORD_LENGTH) {
    return {
      value: nameValidation.value,
      error: `Use at least ${MIN_PASSWORD_LENGTH} characters for your password.`,
    };
  }

  if (password !== passwordConfirmation) {
    return {
      value: nameValidation.value,
      error: "Your passwords do not match.",
    };
  }

  return nameValidation;
}

export function authErrorMessage(error: unknown): string {
  const code =
    typeof error === "object" && error !== null && "code" in error
      ? String(error.code)
      : "";

  switch (code) {
    case "auth/email-already-in-use":
      return "An account already uses that email address.";
    case "auth/invalid-email":
      return "Enter a valid email address.";
    case "auth/invalid-credential":
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "We could not sign you in with those details.";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait a moment and try again.";
    case "auth/network-request-failed":
      return "We could not reach the service. Check your connection and try again.";
    default:
      return "Something went wrong. Please try again.";
  }
}
