import React, { Component } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Input,
  InputGroup,
  FormText
} from "reactstrap";
import firebase from "firebase";
import FileUploader from "react-firebase-file-uploader";
import { LoadingOverlay, Loader } from "react-overlay-loader";
import "react-overlay-loader/styles.css";

class Register extends Component {
  constructor(props) {
    super(props);

    this._create_account = this._create_account.bind(this);
    this.onChange = this.onChange.bind(this);
    this.handleUploadStart = this.handleUploadStart.bind(this);
    this.handleUploadError = this.handleUploadError.bind(this);
    this.handleUploadSuccess = this.handleUploadSuccess.bind(this);
    this.handleProgress = this.handleProgress.bind(this);

    this.state = {
      email: "",
      password: "",
      address: "",
      username: "",
      avatar: "",
      isUploading: false,
      progress: 0,
      avatarURL: "",
      loading: false
    };
  }
  handleUploadStart() {
    this.setState({ isUploading: true, progress: 0, loading: true });
  }
  handleProgress(progress) {
    this.setState({ progress });
  }
  handleUploadError(error) {
    this.setState({ isUploading: false });
    console.error(error);
  }
  handleUploadSuccess(filename) {
    this.setState({ avatar: filename, progress: 100, isUploading: false });
    firebase
      .storage()
      .ref("images")
      .child(filename)
      .getDownloadURL()
      .then(url => this.setState({ avatarURL: url, loading: false }));
  }
  _create_account() {
    this.setState({ loading: true });
    const { email, password } = this.state;
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(user => {
        this.onLoginCreateSuccess(user);
      })
      .catch(error => {
        this.onLoginFail(error);
      });
  }

  onLoginCreateSuccess(user) {
    const { address, username, avatarURL, password } = this.state;
    const userRef = firebase.database().ref("/users");
    const currentUser = firebase.auth().currentUser;
    if (user) {
      userRef.child(currentUser.uid).set({
        email: currentUser.email,
        address: address,
        username: username,
        profileImage: avatarURL,
        password: password
      });
    }
    this.setState({ loading: false });
    this.props.history.push("/home");
  }

  onLoginFail(error) {
    console.log(error);
  }

  onChange(evt) {
    this.setState({ [evt.target.name]: evt.target.value });
  }

  render() {
    const { email, password, username, address, avatarURL } = this.state;
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="6">
              <Card className="mx-4">
                <CardBody className="p-4">
                  <h1>Register</h1>
                  <p className="text-muted">Create your account</p>
                  <InputGroup className="mb-3">
                    <div className="input-group-prepend">
                      <span className="input-group-text">
                        <i className="icon-user" />
                      </span>
                    </div>
                    <Input
                      type="text"
                      placeholder="Username"
                      name="username"
                      onChange={this.onChange}
                      value={username}
                    />
                  </InputGroup>
                  <InputGroup className="mb-3">
                    <div className="input-group-prepend">
                      <span className="input-group-text">@</span>
                    </div>
                    <Input
                      type="text"
                      placeholder="Email"
                      name="email"
                      onChange={this.onChange}
                      value={email}
                    />
                  </InputGroup>
                  <InputGroup className="mb-3">
                    <div className="input-group-prepend">
                      <span className="input-group-text">#</span>
                    </div>
                    <Input
                      type="text"
                      placeholder="Address"
                      name="address"
                      onChange={this.onChange}
                      value={address}
                    />
                  </InputGroup>
                  <InputGroup className="mb-3">
                    <div className="input-group-prepend">
                      <span className="input-group-text">
                        <i className="input-group-text icon-lock" />
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
                  {/* <InputGroup className="mb-3">
                    <Input type="file" />
                    <FormText color="muted">
                      Please select your awesome looking pic...
                    </FormText>
                  </InputGroup> */}
                  <Row>
                    <Col>
                      <label
                        style={{
                          backgroundColor: "steelblue",
                          color: "white",
                          padding: 10,
                          borderRadius: 4,
                          pointer: "cursor"
                        }}
                      >
                        Select
                        <FileUploader
                          hidden
                          accept="image/*"
                          storageRef={firebase.storage().ref("images")}
                          onUploadStart={this.handleUploadStart}
                          onUploadError={this.handleUploadError}
                          onUploadSuccess={this.handleUploadSuccess}
                          onProgress={this.handleProgress}
                        />
                      </label>
                      <FormText color="muted">
                        Please select your awesome pic...
                      </FormText>
                    </Col>

                    <Col style={{ bottom: 10 }}>
                      {this.state.isUploading && (
                        <FormText>Progress: {this.state.progress}</FormText>
                      )}
                      {this.state.avatarURL && (
                        <img
                          style={{
                            width: 150,
                            height: 150,
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: 150 / 2
                          }}
                          src={this.state.avatarURL}
                        />
                      )}
                    </Col>
                  </Row>
                  <Button onClick={this._create_account} color="success" block>
                    Create Account
                  </Button>
                </CardBody>
              </Card>
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

export default Register;
