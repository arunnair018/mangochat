import React from "react";
import { Link } from "react-router-dom";
import SignedInlinks from "./SignedInlinks";
import SignedOutlinks from "./SignedOutlinks";
import cookie from "js-cookie";

const Navbar = () => {
  // set link according to user login status
  const links = cookie.get("user_id") ? <SignedInlinks /> : <SignedOutlinks />;
  // set logo according to device
  const logo =
    window.innerWidth <= 500 && cookie.get("user_id") ? (
      <></>
    ) : (
      <Link to='/' className='brand-logo left content-desktop'>
        {`MangoChat`}
      </Link>
    );
  // render proper jsx
  return (
    <nav className='nav-wrapper black my-nav'>
      <div className='container'>
        {logo}
        {links}
      </div>
    </nav>
  );
};

export default Navbar;
