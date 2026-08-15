import { useState, type FormEvent } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../base";

export default function SignUp() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  async function handleSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);

    try {
      const credential = await createUserWithEmailAndPassword(
        auth,
        String(form.get("email")),
        String(form.get("password")),
      );
      await updateProfile(credential.user, {
        displayName: String(form.get("username")),
      });
      navigate("/main", { replace: true });
    } catch (signupError) {
      setError(
        signupError instanceof Error
          ? signupError.message
          : "Could not create your account.",
      );
    }
  }

  return (
    <section className="jumbotron mt-5 mx-auto auth-panel">
      <h1>Create a profile</h1>
      <form onSubmit={handleSignup}>
        <div className="form-group">
          <label htmlFor="signup-username">Username</label>
          <input
            required
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
            minLength={6}
            autoComplete="new-password"
            name="password"
            type="password"
            className="form-control"
            id="signup-password"
          />
        </div>
        {error && <p className="alert alert-danger mt-3">{error}</p>}
        <div className="d-grid gap-2 col-md-6 pt-4 mx-auto">
          <button type="submit" className="btn btn-primary">
            Create account
          </button>
          <Link to="/login" className="btn btn-link">
            Back to sign in
          </Link>
        </div>
      </form>
    </section>
  );
}
