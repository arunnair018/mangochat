import React, { Component } from "react";
import axios from "axios";
import cookie from "js-cookie";
import { Redirect } from "react-router-dom";
import Navbar from "../layout/Navbar";
import { ReactComponent as Logo } from "./logo.svg";

class SignIn extends Component {
  state = {
    email: "",
    password: "",
    errors: {},
    redirect: false,
  };

  // function to change state when an event is happened
  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value,
    });
  };

  // function to submit the form
  handleSubmit = (e) => {
    e.preventDefault(); // prevents default working of function
    // form the body of request
    const data = {
      email: this.state.email,
      password: this.state.password,
    };
    // axiosfunction to make API call
    axios
      .post(`/users/login`, data)
      .then((res) => {
        // when API call succeed set cookies
        cookie.set("token", res.data.token);
        cookie.set("user_id", res.data.id);
        cookie.set("username", res.data.username);
        this.setState({ redirect: true });
      })
      .catch((res) => {
        // API call not succeed set error to display
        if (!res.response) {
          this.setState({
            errors: {
              error: "Network Error",
            },
          });
        } else {
          this.setState({ errors: res.response.data });
        }
        console.log(this.state);
      });
  };

  // render the jsx with proper data
  render() {
    const errors = this.state.errors;

    //if redirect is set ti true, redirect to dashboard
    const redirect = this.state.redirect;
    if (redirect) {
      return <Redirect to='/chat' />;
    }

    return (
      <div>
        <Navbar />
        <div className='container mycon'>
          <div className='mylogo'>
            <Logo />
          </div>
          <div className='form-container'>
            <form onSubmit={this.handleSubmit} className='myform'>
              <h5 className='white-text text-darken-3'>Sign In</h5>
              <div className='input-field'>
                <label htmlFor='email'>Email</label>
                <input
                  className='input-color-white'
                  type='email'
                  id='email'
                  onChange={this.handleChange}
                />
              </div>
              <div className='input-field'>
                <label htmlFor='password'>Password</label>
                <input
                  className='input-color-white'
                  type='password'
                  id='password'
                  onChange={this.handleChange}
                />
              </div>
              {errors ? (
                <span className='error red-text text-darken-2'>
                  {errors.error}
                </span>
              ) : (
                ""
              )}
              <div className='input-field'>
                <button className='btn purple lighten-2 z-depth-0'>
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default SignIn;
