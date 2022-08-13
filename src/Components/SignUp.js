import React, { useCallback } from "react";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, updateProfile } from "firebase/auth";
import { withRouter } from "react-router-dom";
import app from "../base";

const SignUp = ({ history }) => {
  const auth = getAuth();
  const handleSignup = useCallback(
    async event => {
      event.preventDefault();
      const { email, password, username } = event.target.elements;
      try {
        await
          createUserWithEmailAndPassword(auth, email.value, password.value)
          .then(() => {
            updateProfile(auth.currentUser, {
              displayName: username.value
            });
            // userData.user.updateProfile({
            //   displayName: username.value
            // });
          });
        history.push("/main");
      } catch (error) {
        alert(error);
      }
    },
    [history]
  );

  return (
    <div className="jumbotron mt-5">
      <h1>Create a profile</h1>
      <form onSubmit={handleSignup}>
        <div className="form-group">
          <label htmlFor="pizzaUserName">Username</label>
          <input
            name="username"
            type="text"
            className="form-control"
            id="pizzaUserName"
            placeholder="Choose a username"
          />
        </div>
        <div className="form-group">
          <label htmlFor="examplePizza">Email</label>
          <input
            name="email"
            type="email"
            className="form-control"
            id="examplePizza"
            placeholder="Enter your email"
          />
        </div>
        <div className="form-group">
          <label htmlFor="pizzaUserPassword">Password</label>
          <input
            name="password"
            type="password"
            className="form-control"
            id="pizzaUserPassword"
            placeholder="Choose a password"
          />
        </div>
        <div className="d-grid gap-2 col-md-6 pt-5 mx-auto">
          <button className="btn btn-primary">Create</button>
        </div>
      </form>
    </div>
  );
};

export default withRouter(SignUp);
