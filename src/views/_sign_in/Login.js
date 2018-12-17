import React, { Component } from "react";
import {
  Container,
  Row,
  Col,
  CardGroup,
  Card,
  CardBody,
  Button,
  Input,
  InputGroup,
  InputGroupAddon
} from "reactstrap";
import firebase from "firebase";
import { LoadingOverlay, Loader } from "react-overlay-loader";
import "react-overlay-loader/styles.css";

class Login extends Component {
  constructor(props) {
    super(props);

    this._register = this._register.bind(this);
    this._login = this._login.bind(this);
    this.onChange = this.onChange.bind(this);

    this.state = {
      email: "",
      password: "",
      loading: ""
    };
  }

  _register() {
    this.props.history.push("/register");
  }

  _login() {
    this.setState({ loading: true });
    const { email, password } = this.state;
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(user => {
        this.onLoginSuccess(user);
      })
      .catch(error => {
        this.onLoginFail(error);
      });
  }

  onLoginSuccess(user) {
    this.setState({ loading: false });
    this.props.history.push("/home");
  }

  onLoginFail(error) {
    this.setState({ loading: true });
  }

  onChange(evt) {
    this.setState({ [evt.target.name]: evt.target.value });
    // console.log(this.state.email);
    // console.log(this.state.password);
  }

  render() {
    const { email, password } = this.state;
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="8">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <h1>Login</h1>
                    <p className="text-muted">Sign In to your account</p>
                    <InputGroup className="mb-3">
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <i className="icon-user" />
                        </span>
                      </div>
                      <Input
                        type="text"
                        placeholder="Username"
                        onChange={this.onChange}
                        value={email}
                        name="email"
                      />
                    </InputGroup>
                    <InputGroup className="mb-4">
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <i className="icon-lock" />
                        </span>
                      </div>
                      <Input
                        type="password"
                        placeholder="Password"
                        name="password"
                        onChange={this.onChange}
                        value={password}
                      />
                    </InputGroup>
                    <Row>
                      <Col xs="6">
                        <Button
                          onClick={this._login}
                          color="primary"
                          className="px-4"
                        >
                          Login
                        </Button>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
                <Card
                  className="text-white bg-primary py-5 d-md-down-none"
                  style={{ width: 44 + "%" }}
                >
                  <CardBody className="text-center">
                    <div>
                      <h2>Sign up</h2>
                      <p>
                        Would you like to cheer with us ? If, please join with
                        us by clicking register button below.
                      </p>
                      <Button
                        onClick={this._register}
                        color="primary"
                        className="mt-3"
                        active
                      >
                        Register Now!
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
          <LoadingOverlay
            style={{ width: 200, height: 200, backgroundColor: "transparent" }}
          >
            <Loader fullPage loading={this.state.loading} />
          </LoadingOverlay>
        </Container>
      </div>
    );
  }
}

export default Login;
