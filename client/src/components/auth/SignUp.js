import React, { Component } from "react";
import axios from "axios";
import cookie from "js-cookie";
import Navbar from "../layout/Navbar";

import { ReactComponent as Logo } from "./logo.svg";

class SignUp extends Component {
  state = {
    username: "",
    email: "",
    password: "",
    errors: {},
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
      username: this.state.username,
      email: this.state.email,
      password: this.state.password,
      name: this.state.username,
    };
    // axiosfunction to make API call
    axios
      .post(`/api/users`, data)
      .then((res) => {
        console.log(res);
        cookie.set("token", res.data.token);
        cookie.set("user_id", res.data.id);
        cookie.set("username", res.data.username);
        this.props.history.push("/chat");
      })
      .catch((err) => {
        // API call not succeed set error to display
        this.setState({ errors: err.response.data });
        console.log(this.state);
      });
  };

  // check for password matching
  confirmPassword = (e) => {
    if (e.target.value !== this.state.password) {
      this.setState({
        errors: {
          error: "Passwords not matching.",
        },
      });
    } else {
      this.setState({ errors: {} });
    }
  };

  // render the jsx with proper data
  render() {
    const errors = this.state.errors;
    return (
      <div>
        <Navbar />
        <div className='container mycon'>
          <div className='mylogo'>
            <Logo />
          </div>
          <div className='form-container'>
            <form onSubmit={this.handleSubmit} className='signupform'>
              <h5 className='white-text text-darken-3'>Sign Up</h5>
              <div className='input-field'>
                <label htmlFor='username'>Username</label>
                <input
                  className='input-color-white'
                  type='text'
                  id='username'
                  onChange={this.handleChange}
                />
              </div>
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
              <div className='input-field'>
                <label htmlFor='confirm_password'>Confirm Password</label>
                <input
                  className='input-color-white'
                  type='password'
                  id='confirm_password'
                  onChange={this.confirmPassword}
                />
              </div>
              {Object.keys(errors).length > 0 ? (
                errors.error ? (
                  <span className='error red-text text-darken-2'>
                    {errors.error}
                  </span>
                ) : (
                  <span className='error red-text text-darken-2'>
                    Existing {Object.keys(errors)}
                  </span>
                )
              ) : (
                ""
              )}
              <div className='input-field'>
                <button className='btn purple lighten-2 z-depth-0'>
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default SignUp;
