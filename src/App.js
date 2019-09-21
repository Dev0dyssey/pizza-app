import React, { useState } from "react";
import { Router, Route, Switch } from "react-router-dom";
import history from "./history";
import LogIn from "./Components/LogIn";
import "./App.css";

const App = () => {
  const [pizza] = useState("Pepperoni");

  return (
    <div className="container">
      <h1>An amazing pizza rating App!</h1>
      <Router history={history}>
        <Switch>
          <Route path="/" exact component = {LogIn}/>
        </Switch>
      </Router>
    </div>
  );
};

export default App;
