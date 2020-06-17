// import required modules
import React, { Component } from "react";
import { BrowserRouter, Switch } from "react-router-dom";
// import user defined modules
import Dashboard from "./components/dashboard/Chat";
import SignIn from "./components/auth/SignIn";
import SignUp from "./components/auth/SignUp";
import PrivateRoute from "./utils/PrivateRoute";
import PublicRoute from "./utils/PublicRoute";

// App class which will be rendered in root DOM
class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className='App'>
          <Switch>
            <PublicRoute exact path='/' component={SignIn} />
            <PublicRoute path='/signup' component={SignUp} />
            <PrivateRoute path='/chat' component={Dashboard} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
