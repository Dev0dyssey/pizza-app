import { useState, type FormEvent } from "react";
import { sendEmailVerification, updateProfile } from "firebase/auth";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../auth-context";
import { auth } from "../../base";
import { demoMode } from "../../config";
import {
  authErrorMessage,
  validateDisplayName,
} from "../../Features/Auth/authForm";
import NavBar from "../../UIComponents/NavBar";

export default function ProfileSettings() {
  const { currentUser, refreshCurrentUser } = useAuth();
  const location = useLocation();
  const state = location.state as { notice?: string } | null;
  const [displayName, setDisplayName] = useState(currentUser?.displayName ?? "");
  const [saving, setSaving] = useState(false);
  const [verificationSending, setVerificationSending] = useState(false);
  const [message, setMessage] = useState(state?.notice ?? "");
  const [error, setError] = useState("");

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    const validation = validateDisplayName(displayName);

    if (validation.error) {
      setError(validation.error);
      return;
    }

    if (demoMode) {
      setMessage("Demo mode does not persist profile changes.");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      setError("Your session has ended. Please sign in again.");
      return;
    }

    setSaving(true);
    try {
      await updateProfile(user, { displayName: validation.value });
      await refreshCurrentUser();
      setDisplayName(validation.value);
      setMessage("Your profile has been updated.");
    } catch (profileError) {
      setError(authErrorMessage(profileError));
    } finally {
      setSaving(false);
    }
  }

  async function resendVerification() {
    setError("");
    setMessage("");
    const user = auth.currentUser;

    if (!user) {
      setError("Your session has ended. Please sign in again.");
      return;
    }

    setVerificationSending(true);
    try {
      await sendEmailVerification(user);
      setMessage("Verification email sent. Check your inbox, then return here.");
    } catch (verificationError) {
      setError(authErrorMessage(verificationError));
    } finally {
      setVerificationSending(false);
    }
  }

  async function refreshVerificationStatus() {
    setError("");
    setMessage("");
    try {
      await refreshCurrentUser();
      setMessage(
        auth.currentUser?.emailVerified
          ? "Your email address is verified."
          : "Your email is not verified yet. Please check the link in your inbox.",
      );
    } catch (refreshError) {
      setError(authErrorMessage(refreshError));
    }
  }

  return (
    <>
      <NavBar />
      <section className="card p-4">
        <h1 className="h3">Profile</h1>
        <form onSubmit={(event) => void saveProfile(event)}>
          <div className="mb-3">
            <label className="form-label" htmlFor="profile-display-name">
              Name
            </label>
            <input
              required
              minLength={2}
              maxLength={50}
              autoComplete="nickname"
              className="form-control"
              id="profile-display-name"
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
            />
          </div>
          <dl>
            <dt>Email</dt>
            <dd>{currentUser?.email || "Not available"}</dd>
            <dt>Email status</dt>
            <dd>{currentUser?.emailVerified ? "Verified" : "Not verified"}</dd>
          </dl>
          {!currentUser?.emailVerified && !demoMode && (
            <div className="d-flex flex-wrap gap-2 mb-3">
              <button
                className="btn btn-outline-primary"
                type="button"
                disabled={verificationSending}
                onClick={() => void resendVerification()}
              >
                {verificationSending ? "Sending…" : "Resend verification email"}
              </button>
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={() => void refreshVerificationStatus()}
              >
                I have verified my email
              </button>
            </div>
          )}
          {error && <p className="alert alert-danger">{error}</p>}
          {message && <p className="alert alert-success">{message}</p>}
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "Saving…" : "Save profile"}
          </button>
        </form>
      </section>
    </>
  );
}
