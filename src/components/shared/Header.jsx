import React from 'react';
import { Link } from 'react-router-dom';
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';
import cssScheme from '../../css/header.scss'

const renderLogin = () => (
  <Nav className="ml-auto" navbar>
    <NavItem>
      <NavLink tag={Link} to="/account/login">Log In</NavLink>
    </NavItem>
    <NavItem>
      <NavLink tag={Link} to="/account/register">Register</NavLink>
    </NavItem>
  </Nav>
);

export default class Header extends React.Component {
  constructor(props) {
    super(props);
    this.logOutClick = this.logOutClick.bind(this);
    this.renderGreeting = this.renderGreeting.bind(this);
    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.state = {
      isOpen: false,
    };
  }

  logOutClick(e) {
    e.preventDefault();
    const { logUserOutFunction } = this.props;
    logUserOutFunction();
  }

  toggleNavbar() {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  renderGreeting(name) {
    return (
      <div>
        <Nav className="ml-auto" navbar>
          <NavItem className = "welcome">
            Welcome, {name} | <a href="/logout" onClick={this.logOutClick}>Log Out</a>
          </NavItem>
        </Nav>
      </div>
    );
  }

  render() {
    const { isLoggedIn, firstName } = this.props.authentication;
    return (
      <div className="wrapper">
        <Navbar>
          <NavbarBrand tag={Link} to="/">Fletchr</NavbarBrand>
            { isLoggedIn ? this.renderGreeting(firstName) : renderLogin() }
        </Navbar>
      </div>
    );
  }
}