import React, { useContext, useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import { AuthContext } from "./Auth";

const PrivateRoute = ({ component: RouteComponent, path, ...rest }) => {
  const { currentUser } = useContext(AuthContext);
  useEffect(() => {
    console.log(`Current user is ${currentUser}`)
  })

  return (
    <Route
      path={path}
      {...rest}
      render={routeProps =>
        !!currentUser ? (
          <RouteComponent {...routeProps} />
        ) : (
          <Redirect to={"/login"} />
        )
      }
    />
  );
};

export default PrivateRoute;
