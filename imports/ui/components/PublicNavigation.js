import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Nav, NavItem } from 'react-bootstrap';

const PublicNavigation = () => (
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
      <LinkContainer to="/documentation">
        <NavItem eventKey={3} href="/documentation">Documentation / FAQ</NavItem>
      </LinkContainer>
      <LinkContainer to="/about">
        <NavItem eventKey={4} href="/about">About</NavItem>
      </LinkContainer>
      <LinkContainer to="/signup">
        <NavItem eventKey={5} href="/signup">Sign Up</NavItem>
      </LinkContainer>
      <LinkContainer to="/login">
        <NavItem eventKey={6} href="/login">Log In</NavItem>
      </LinkContainer>
    </Nav>
  </div>

);

export default PublicNavigation;
