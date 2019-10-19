import React, { useCallback } from "react";
import { withRouter } from "react-router-dom";
import app from "../base";

const SignUp = ({ history }) => {
  const handleSignup = useCallback(
    async event => {
      event.preventDefault();
      const { email, password } = event.target.elements;
      try {
        await app
          .auth()
          .createUserWithEmailAndPassword(email.value, password.value);
        history.push("/main");
      } catch (error) {
        alert(error);
      }
    },
    [history]
  );

  return (
    <div className="jumbotron mt-5">
      <h1>Create a user profile</h1>
      <form onSubmit={handleSignup}>
        <div className="form-group">
          <label for="examplePizza">Email</label>
          <input
            name="email"
            type="email"
            className="form-control"
            id="examplePizza"
            placeholder="Enter your email"
          />
        </div>
        <div className="form-group">
          <label for="pizzaUserPassword">Password</label>
          <input
            name="password"
            type="password"
            className="form-control"
            id="pizzaUserPassword"
            placeholder="Choose a password"
          />
        </div>
        
          <button className="btn btn-primary">
            Create
          </button>
        
      </form>
    </div>
  );
};

export default withRouter(SignUp);
