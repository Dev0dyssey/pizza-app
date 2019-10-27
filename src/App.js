import React from "react";
import { Router, Route } from "react-router-dom";
import history from "./history";
import Landing from './Components/LandingPage';
import LogIn from "./Components/LogIn";
import MainPage from "./Components/MainPage";
import { AuthProvider } from './Auth';
import PrivateRoute from './PrivateRoute';
import SignUp from './Components/SignUp';

const App = () => {
  return (
    <div className="container landing">
      <div className="row">
        <div className="col-2"></div>
        <div className="col-8 min-vh-100">
          <AuthProvider>
            <Router history={history}>
                <Route path="/" exact component={Landing} />
                <Route path="/login" exact component={LogIn} />
                <Route path="/signup" exact component={SignUp} />
                <PrivateRoute path="/main" exact component={MainPage} />
            </Router>
          </AuthProvider>
        </div>
        <div className="col-2"></div>
      </div>
    </div>
  );
};

export default App;
