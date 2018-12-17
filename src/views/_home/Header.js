import React, { Component } from "react";
import PropTypes from "prop-types";
import { Nav, NavbarBrand, NavbarToggler, NavItem, Button } from "reactstrap";
import firebase from "firebase";

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      avatarURL: ""
    };
  }

  sidebarToggle(e) {
    e.preventDefault();
    document.body.classList.toggle("sidebar-hidden");
  }

  sidebarMinimize(e) {
    e.preventDefault();
    document.body.classList.toggle("sidebar-minimized");
  }

  mobileSidebarToggle(e) {
    e.preventDefault();
    document.body.classList.toggle("sidebar-mobile-show");
  }

  asideToggle(e) {
    e.preventDefault();
    document.body.classList.toggle("aside-menu-hidden");
  }

  componentDidMount() {
    this.fetchUserData();
  }

  fetchUserData() {
    const currentUserId = firebase.auth().currentUser.uid;
    this.setState({ uid: currentUserId, loading: true });
    firebase
      .database()
      .ref("/users")
      .child(currentUserId)
      .on("value", snap => {
        this.setState({
          avatarURL: snap.val().profileImage
        });
      });
    this.setState({ loading: false });
  }

  render() {
    const { avatarURL } = this.state;
    return (
      <header className="app-header navbar">
        <NavbarToggler className="d-lg-none" onClick={this.mobileSidebarToggle}>
          <span className="navbar-toggler-icon" />
        </NavbarToggler>

        <Nav
          style={{
            marginLeft: 50,
            marginRight: 50,
            fontSize: 24,
            fontWeight: "bold",
            color: "gray"
          }}
        >
          Nano Precise
        </Nav>

        <Nav className="ml-auto" navbar>
          <Button onClick={this.props.signOut} className="btn-primary">
            <i className="icon-logout" />
          </Button>
          <img
            onClick={this.props.onClick}
            src={avatarURL}
            style={{
              width: 50,
              height: 50,
              borderRadius: 50 / 2,
              marginRight: 20,
              marginLeft: 20
            }}
          />
        </Nav>
      </header>
    );
  }
}

export default Header;
