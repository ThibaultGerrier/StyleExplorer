import React from 'react';
import { withRouter } from 'react-router-dom';
import { Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';

const handleLogout = (props) => {
  Meteor.logout(() => {
    props.history.push('/');
    Bert.alert('Bye!', 'success');
  });
};

const userName = () => {
  const user = Meteor.user();
  const name = user && user.profile ? user.profile.name : '';
  return user ? `${name.first} ${name.last}` : '';
};

const AuthenticatedNavigation = props => (
  <div>
    <Nav>
      <LinkContainer to="/documents">
        <NavItem eventKey={ 1 } href="/documents">My Documents</NavItem>
      </LinkContainer>
      <LinkContainer to="/public">
        <NavItem eventKey={ 2 } href="/public">Public Documents</NavItem>
      </LinkContainer>
    </Nav>
    <Nav pullRight>
      <LinkContainer to="about">
        <NavItem eventKey={ 1 } href="/about">About</NavItem>
      </LinkContainer>
      <NavDropdown eventKey={ 3 } title={ userName() } id="basic-nav-dropdown">
        <MenuItem eventKey={ 3.1 } onClick={ () => handleLogout(props) }>Logout</MenuItem>
      </NavDropdown>
    </Nav>
  </div>);

export default withRouter(AuthenticatedNavigation);
