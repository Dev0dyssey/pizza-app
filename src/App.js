import React, { useState } from "react";
import { Router, Route, Switch } from "react-router-dom";
import history from "./history";
import Landing from './Components/LandingPage';
import LogIn from "./Components/LogIn";
import MainPage from "./Components/MainPage";
// import './StyleSheets/main.css';

const App = () => {
  const [pizza] = useState("Pepperoni");

  return (
    <div className="container landing">
      <div className="row">
        <div className="col-2"></div>
        <div className="col-8 min-vh-100">
          <Router history={history}>
            <Switch>
              <Route path="/" exact component={Landing} />
              <Route path="/login" exact component={LogIn} />
              <Route path="/main" exact component={MainPage} />
            </Switch>
          </Router>
        </div>
        <div className="col-2"></div>
      </div>
    </div>
  );
};

export default App;
