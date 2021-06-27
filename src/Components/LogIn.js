import React, { useState, useCallback, useContext } from "react";
import { withRouter, Redirect, Link } from "react-router-dom";
import app from "../base";
import "../StyleSheets/landing.css";
import { AuthContext } from "../Auth";

const LogIn = ({ history }) => {
  const [email, setEmail] = useState("");
  const [emailStatus, changeStatus] = useState(false);

  const handleLogin = useCallback(
    async (event) => {
      event.preventDefault();
      const { email, password } = event.target.elements;
      try {
        await app
          .auth()
          .signInWithEmailAndPassword(email.value, password.value);
        history.push("/main");
      } catch (error) {
        alert(error);
      }
    },
    [history]
  );

  const resetPasswordEmail = () => {
    console.log(`Reset Password email sent`);
    app
      .auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        changeStatus(true);
      })
      .catch((err) => {
        console.log(`An error has occured`, err);
      });
  };

  const { currentUser } = useContext(AuthContext);

  if (currentUser) {
    return <Redirect to="/main" />;
  }

  return (
    <div className="jumbotron mt-5">
      <h1 className="text-center">
        vRate!
      </h1>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <input
            name="email"
            type="email"
            className="form-control"
            id="examplePizza"
            placeholder="Enter Pizza user Email"
          />
          <small id="emailHelp" className="form-text text-muted">
            Please enter your registerd email
          </small>
        </div>
        <div className="form-group pt-2">
          <input
            name="password"
            type="password"
            className="form-control"
            id="pizzaUserPassword"
            placeholder="Please enter your password"
          />
        </div>

        <div className="d-grid gap-2 col-md-6 mx-auto loginActionButtons" style={{ marginTop: "1rem" }}>
          <button type="submit" className="btn btn-success">
            Enter
          </button>
          <Link to={"/signup"}>
            <button type="button" className="btn btn-primary" style={{ width: "100%" }}>
              Sign up
            </button>
          </Link>
          <div className="resetBtn" style={{ hover: "pointer" }}>
            <span data-bs-toggle="modal" data-bs-target="#resetPasswordModal">
              Forgot your password?
            </span>
          </div>
        </div>
        <div
          className="modal"
          id="resetPasswordModal"
          tabIndex="-1"
          role="dialog"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <div className="modal-title"> Reset Password Request</div>
              </div>
              <div className="modal-body">
                <div className="inputGroup">
                  {emailStatus && (
                    <div>
                      <p>
                        A password reset link was sent to the email address you
                        entered!
                      </p>
                    </div>
                  )}
                  {!emailStatus && (
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Please enter the email you used to register"
                      onChange={(e) => {
                        const resetEmail = e.target.value;
                        setEmail(resetEmail);
                      }}
                    />
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                  onClick={() => changeStatus(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={resetPasswordEmail}
                >
                  Reset Password
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default withRouter(LogIn);

// Sandbox
/*
    const [newPizza, setPizza] = useState("Mexican Pizza!")
    const specials = (val) => {
        return (val +1)
    }
    return (
        <div>
            <h5>More Pizza Awaits!</h5>
            <p>Starting off with {originalPizza}</p>
            <h2>Brand new addition: { newPizza }! Only with {specials(2)}</h2>
            <p>Or create your own! What will it be <input type="text" placeholder="Yum" onChange={e => setPizza(e.target.value)}></input></p>
        </div>
    )
    */
