import { describe, expect, it } from "vitest";
import {
  MIN_PASSWORD_LENGTH,
  authErrorMessage,
  normalizeEmail,
  validateDisplayName,
  validateSignUp,
} from "./authForm";

describe("account form helpers", () => {
  it("normalizes email addresses before they are submitted", () => {
    expect(normalizeEmail("  PIZZA@Example.COM ")).toBe("pizza@example.com");
  });

  it("normalizes a display name and rejects a one-character name", () => {
    expect(validateDisplayName("  Friday   Pizza Club ")).toEqual({
      value: "Friday Pizza Club",
      error: null,
    });
    expect(validateDisplayName("A").error).toMatch(/at least/);
  });

  it("requires a sufficiently long, confirmed password", () => {
    expect(
      validateSignUp({
        displayName: "Alex",
        password: "a".repeat(MIN_PASSWORD_LENGTH - 1),
        passwordConfirmation: "a".repeat(MIN_PASSWORD_LENGTH - 1),
      }).error,
    ).toMatch(/at least/);
    expect(
      validateSignUp({
        displayName: "Alex",
        password: "a".repeat(MIN_PASSWORD_LENGTH),
        passwordConfirmation: "different-password",
      }).error,
    ).toBe("Your passwords do not match.");
  });

  it("does not expose whether an email exists when sign-in fails", () => {
    expect(authErrorMessage({ code: "auth/user-not-found" })).toBe(
      "We could not sign you in with those details.",
    );
  });

  it("explains Google popup failures without exposing provider details", () => {
    expect(authErrorMessage({ code: "auth/popup-closed-by-user" })).toBe(
      "Google sign-in was cancelled.",
    );
  });
});
