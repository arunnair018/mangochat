//import required modules
import React from "react";
import { Route, Redirect } from "react-router-dom";
import cookie from "js-cookie";

const PublicRoute = ({
  component: Component, // component as props
  restricted, // restricted props if true component becomes restricted
  ...rest // default props of route
}) => {
  return (
    // restricted = false meaning public route
    // restricted = true meaning restricted route
    <Route
      {...rest}
      render={(props) =>
        cookie.get("user_id") ? ( // if cookie present
          <Redirect to='/chat' /> // redirect to dashboard
        ) : (
          <Component {...props} />
        )
      }
    />
  ); // load the component
};

export default PublicRoute;
