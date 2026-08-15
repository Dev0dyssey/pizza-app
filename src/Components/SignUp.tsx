import { useState, type FormEvent } from "react";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../auth-context";
import { auth } from "../base";
import {
  MIN_PASSWORD_LENGTH,
  authErrorMessage,
  normalizeEmail,
  validateSignUp,
} from "../Features/Auth/authForm";

export default function SignUp() {
  const navigate = useNavigate();
  const { currentUser, refreshCurrentUser } = useAuth();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const validation = validateSignUp({
      displayName: String(form.get("username")),
      password: String(form.get("password")),
      passwordConfirmation: String(form.get("passwordConfirmation")),
    });

    if (validation.error) {
      setError(validation.error);
      return;
    }

    setSubmitting(true);
    let credential;
    try {
      credential = await createUserWithEmailAndPassword(
        auth,
        normalizeEmail(String(form.get("email"))),
        String(form.get("password")),
      );
    } catch (signupError) {
      setError(authErrorMessage(signupError));
      setSubmitting(false);
      return;
    }

    let notice = "Account created. Please verify your email address.";
    try {
      await updateProfile(credential.user, {
        displayName: validation.value,
      });
    } catch {
      notice = "Your account was created. Add your profile name from the Profile page.";
    }

    try {
      await sendEmailVerification(credential.user);
    } catch {
      notice = "Your account was created. Send a verification email from the Profile page.";
    }

    try {
      await refreshCurrentUser();
    } finally {
      setSubmitting(false);
    }
    navigate("/main/profilesettings", { replace: true, state: { notice } });
  }

  if (currentUser && !submitting) {
    return <Navigate to="/main" replace />;
  }

  return (
    <section className="jumbotron mt-5 mx-auto auth-panel">
      <h1>Create a profile</h1>
      <form onSubmit={handleSignup}>
        <div className="form-group">
          <label htmlFor="signup-username">Username</label>
          <input
            required
            minLength={2}
            maxLength={50}
            autoComplete="nickname"
            name="username"
            type="text"
            className="form-control"
            id="signup-username"
          />
        </div>
        <div className="form-group mt-3">
          <label htmlFor="signup-email">Email</label>
          <input
            required
            autoComplete="email"
            name="email"
            type="email"
            className="form-control"
            id="signup-email"
          />
        </div>
        <div className="form-group mt-3">
          <label htmlFor="signup-password">Password</label>
          <input
            required
            minLength={MIN_PASSWORD_LENGTH}
            autoComplete="new-password"
            name="password"
            type="password"
            className="form-control"
            id="signup-password"
          />
        </div>
        <div className="form-group mt-3">
          <label htmlFor="signup-password-confirmation">Confirm password</label>
          <input
            required
            minLength={MIN_PASSWORD_LENGTH}
            autoComplete="new-password"
            name="passwordConfirmation"
            type="password"
            className="form-control"
            id="signup-password-confirmation"
          />
        </div>
        {error && <p className="alert alert-danger mt-3">{error}</p>}
        <div className="d-grid gap-2 col-md-6 pt-4 mx-auto">
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? "Creating account…" : "Create account"}
          </button>
          <Link to="/login" className="btn btn-link">
            Back to sign in
          </Link>
        </div>
      </form>
    </section>
  );
}
