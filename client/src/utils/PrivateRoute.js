// import required modules
import React from 'react';
import {Route, Redirect} from 'react-router-dom';
import cookie from 'js-cookie';

const PrivateRoute = ({
  component: Component, // component passed as props
  ...rest // spread other route props
}) => {
  return (
  // Show the component only when the user is logged in
  // Otherwise, redirect the user to /signin page
  <Route {...rest} render={props => (
      cookie.get('user_id') // if cookie present
      ? <Component {...props}/> //load components with required props
      : <Redirect to="/"/>)}/>); //redirect to "/"
};

export default PrivateRoute;
