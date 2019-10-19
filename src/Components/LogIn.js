import React, { useCallback, useContext } from "react";
import { withRouter, Redirect, Link } from "react-router-dom";
import app from "../base";
import { AuthContext } from "../Auth";

const LogIn = ({ history }) => {
  const handleLogin = useCallback(
    async event => {
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

  const { currentUser } = useContext(AuthContext);

  if (currentUser) {
    return <Redirect to="/main" />;
  }

  return (
    <div className="jumbotron mt-5">
      <h1>An amazing pizza rating App!</h1>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label for="examplePizza">Pizza user email</label>
          <input
            name="email"
            type="email"
            className="form-control"
            id="examplePizza"
            placeholder="Enter Pizza user Email"
          />
          <small id="emailHelp" className="form-text text-muted">
            We MIGHT share your pizza user tag (*hint* Pineapples are evil).
          </small>
        </div>
        <div className="form-group">
          <label for="pizzaUserPassword">Password</label>
          <input
            name="password"
            type="password"
            className="form-control"
            id="pizzaUserPassword"
            placeholder="Please enter your password"
          />
        </div>

        <button type="submit" className="btn btn-success">
          Enter
        </button>
        <Link to={"/signup"}>
          <button className="btn btn-primary" style={{ marginLeft: "0.5rem" }}>
            Sign up
          </button>
        </Link>
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
