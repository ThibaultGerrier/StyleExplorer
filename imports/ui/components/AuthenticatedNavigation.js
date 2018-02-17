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
  return user ? user.username : '';
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
      <LinkContainer to="documentation">
        <NavItem eventKey={ 3 } href="/documentation">Documentation / FAQ</NavItem>
      </LinkContainer>
      <LinkContainer to="about">
        <NavItem eventKey={ 4 } href="/about">About</NavItem>
      </LinkContainer>
      <NavDropdown eventKey={ 5 } title={ userName() } id="basic-nav-dropdown">
        <MenuItem eventKey={ 5.1 } onClick={ () => handleLogout(props) }>Logout</MenuItem>
      </NavDropdown>
    </Nav>
  </div>);

export default withRouter(AuthenticatedNavigation);
