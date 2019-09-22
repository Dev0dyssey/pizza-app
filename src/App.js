import React, { useState } from "react";
import { Router, Route, Switch } from "react-router-dom";
import history from "./history";
import Landing from './Components/LandingPage';
import LogIn from "./Components/LogIn";
import MainPage from "./Components/MainPage";
// import './StyleSheets/main.css';

const App = () => {
  const [user, setUser] = useState({tag: "Pizza", pizza: "More Pizza" });
  const getUser = ( newUser ) => {
    const userNew = newUser;
    setUser(userNew);
  };

  return (
    <div className="container landing">
      <div className="row">
        <div className="col-2"></div>
        <div className="col-8 min-vh-100">
          <Router history={history}>
            <Switch>
              <Route path="/" exact component={Landing} />
              <Route path="/login" exact render={(props) => <LogIn {...props} getUser = {getUser} />} />
              <Route path="/main" exact render={(props) => <MainPage {...props} user = {user} />} />
            </Switch>
          </Router>
        </div>
        <div className="col-2"></div>
      </div>
    </div>
  );
};

export default App;
