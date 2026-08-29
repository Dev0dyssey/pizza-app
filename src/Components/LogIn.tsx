import { useState, type FormEvent } from "react";
import {
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithPopup,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../auth-context";
import { auth } from "../base";
import { authErrorMessage, normalizeEmail } from "../Features/Auth/authForm";
import "../StyleSheets/landing.css";

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

export default function LogIn() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resetSubmitting, setResetSubmitting] = useState(false);

  if (currentUser) {
    return <Navigate to="/main" replace />;
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);

    setSubmitting(true);
    try {
      await signInWithEmailAndPassword(
        auth,
        normalizeEmail(String(form.get("email"))),
        String(form.get("password")),
      );
      navigate("/main", { replace: true });
    } catch (loginError) {
      setError(authErrorMessage(loginError));
    } finally {
      setSubmitting(false);
    }
  }

  async function resetPassword() {
    setError("");

    setResetSubmitting(true);
    try {
      await sendPasswordResetEmail(auth, normalizeEmail(resetEmail));
      setResetSent(true);
    } catch (resetError) {
      setError(authErrorMessage(resetError));
    } finally {
      setResetSubmitting(false);
    }
  }

  async function signInWithGoogle() {
    setError("");
    setSubmitting(true);

    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/main", { replace: true });
    } catch (googleError) {
      setError(authErrorMessage(googleError));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="jumbotron mt-5 mx-auto auth-panel">
      <h1 className="text-center">Pizza Rate</h1>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="login-email">Email</label>
          <input
            required
            autoComplete="email"
            name="email"
            type="email"
            className="form-control"
            id="login-email"
            placeholder="Enter your email"
          />
        </div>
        <div className="form-group pt-2">
          <label htmlFor="login-password">Password</label>
          <input
            required
            autoComplete="current-password"
            name="password"
            type="password"
            className="form-control"
            id="login-password"
            placeholder="Enter your password"
          />
        </div>
        {error && <p className="alert alert-danger mt-3">{error}</p>}
        <div className="d-grid gap-2 col-md-6 mx-auto mt-3">
          <button type="submit" className="btn btn-success" disabled={submitting}>
            {submitting ? "Signing in…" : "Sign in"}
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary"
            disabled={submitting}
            onClick={() => void signInWithGoogle()}
          >
            Continue with Google
          </button>
          <Link to="/signup" className="btn btn-primary">
            Sign up
          </Link>
          <button
            type="button"
            className="btn btn-link"
            data-bs-toggle="modal"
            data-bs-target="#resetPasswordModal"
          >
            Forgot your password?
          </button>
        </div>
      </form>

      <div
        className="modal fade"
        id="resetPasswordModal"
        tabIndex={-1}
        aria-labelledby="resetPasswordTitle"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title fs-5" id="resetPasswordTitle">
                Reset password
              </h2>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              {resetSent ? (
                <p>A password reset link has been sent.</p>
              ) : (
                <>
                  <label htmlFor="reset-email">Account email</label>
                  <input
                    required
                    id="reset-email"
                    type="email"
                    autoComplete="email"
                    className="form-control"
                    value={resetEmail}
                    onChange={(event) => setResetEmail(event.target.value)}
                  />
                </>
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={() => setResetSent(false)}
              >
                Close
              </button>
              {!resetSent && (
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={!resetEmail || resetSubmitting}
                  onClick={() => void resetPassword()}
                >
                  {resetSubmitting ? "Sending…" : "Send reset link"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
