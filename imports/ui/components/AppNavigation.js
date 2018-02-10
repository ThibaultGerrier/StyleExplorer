import React from 'react';
import PropTypes from 'prop-types';
import { Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PublicNavigation from './PublicNavigation.js';
import AuthenticatedNavigation from './AuthenticatedNavigation.js';


const AppNavigation = props =>
  (
    <Navbar>
      <Navbar.Header>
        <Navbar.Brand>
          <Link to="/">Writing Styles</Link>
        </Navbar.Brand>
        <Navbar.Toggle/>
      </Navbar.Header>
      <Navbar.Collapse>
        {props.authenticated ?
          <AuthenticatedNavigation {...props} />
          : <PublicNavigation/>}
      </Navbar.Collapse>
    </Navbar>
  );


AppNavigation.propTypes = {
  authenticated: PropTypes.bool,
};

export default AppNavigation;
