import React from "react";
import { NavLink } from "react-router-dom";

const SignedOutlinks = () => {
  return (
    <ul className='right'>
      <li>
        <NavLink to='/signup'>SignUp</NavLink>
      </li>
      <li>
        <NavLink to='/'>LogIn</NavLink>
      </li>
    </ul>
  );
};

export default SignedOutlinks;
