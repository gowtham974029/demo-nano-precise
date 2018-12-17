import React from "react";
import ReactDOM from "react-dom";
import { HashRouter, Route, Switch } from "react-router-dom";
import firebase from "firebase";

// Styles
// Import Flag Icons Set
import "flag-icon-css/css/flag-icon.min.css";
// Import Font Awesome Icons Set
import "font-awesome/css/font-awesome.min.css";
// Import Simple Line Icons Set
import "simple-line-icons/css/simple-line-icons.css";
// Import Main styles for this application
import "../scss/style.scss";
// Temp fix for reactstrap
import "../scss/core/_dropdown-menu-right.scss";

const firebaseConfig = {
  apiKey: "AIzaSyBbP8AXXgqu3JbrUDzLwH-P2v9UENj_C0A",
  authDomain: "fir-nano-precise.firebaseapp.com",
  databaseURL: "https://fir-nano-precise.firebaseio.com",
  projectId: "fir-nano-precise",
  storageBucket: "fir-nano-precise.appspot.com",
  messagingSenderId: "912869488721"
};

firebase.initializeApp(firebaseConfig);
// Screens
import Login from "./views/_sign_in/Login";
import Register from "./views/_sign_up/Register";
import Home from "./views/_home/Home";
import UserUpdate from "./views/_user_update/UserUpdate";

ReactDOM.render(
  <HashRouter>
    <Switch>
      <Route exact path="/" name="Login" component={Login} />
      <Route exact path="/register" name="Register" component={Register} />
      <Route exact path="/home" name="Home" component={Home} />
      <Route exact path="/user" name="User" component={UserUpdate} />
    </Switch>
  </HashRouter>,
  document.getElementById("root")
);
