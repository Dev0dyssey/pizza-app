import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import { AuthProvider } from "./Auth";
import history from "./history";
import Landing from "./Components/LandingPage";
import SignUp from "./Components/SignUp";
import LogIn from "./Components/LogIn";
import MainPage from "./Components/MainPage";
import NewPizzasOverview from "./Components/NewPizzaSection/NewPizzasOverview";
import PrivateRoute from "./PrivateRoute";

const App = () => {
  return (
    <div className="container landing">
      <div className="row">
        <div className="col-2"></div>
        <div className="col-8 min-vh-100">
          <Router history={history}>
            <AuthProvider>
              <Switch>
                <Route path="/" exact component={Landing} />
                <Route path="/login" component={LogIn} />
                <Route path="/signup" component={SignUp} />
                <PrivateRoute path="/main" exact component={MainPage} />
                <PrivateRoute
                  path="/main/newpizzas"
                  exact
                  component={NewPizzasOverview}
                />
              </Switch>
            </AuthProvider>
          </Router>
        </div>
        <div className="col-2"></div>
      </div>
    </div>
  );
};

export default App;
