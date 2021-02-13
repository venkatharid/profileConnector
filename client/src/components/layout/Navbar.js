import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const Navbar = () => {
    return (
    <nav className="navbar bg-dark">
      <h1>
          <Link to='/'>
        <a href="index.html"><i className="fas fa-code"></i> ProfileConnector</a>
        </Link>
      </h1>
      <ul>
        <li><a href="#!">Profile</a></li>
        <li><Link to="register">Register</Link></li>
        <li><Link to="login">Login</Link></li>
      </ul>
    </nav>
    )
}

export default Navbar;