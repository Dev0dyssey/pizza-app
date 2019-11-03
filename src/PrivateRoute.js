import React, { useContext } from "react";
import { Route } from "react-router-dom";
import { AuthContext } from "./Auth";
import LogIn from "./Components/LogIn";

const PrivateRoute = ({ component, ...options }) => {
  const { currentUser } = useContext(AuthContext);
  const authorisedComponent = currentUser ? component : LogIn

  return (
    <Route
      {...options} component={authorisedComponent}
    />
  );
};

export default PrivateRoute;
