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

class UserUpdate extends Component {
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
      loading: false,
      uid: ""
    };
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
          email: snap.val().email,
          address: snap.val().address,
          avatarURL: snap.val().profileImage,
          username: snap.val().username
        });
      });
    this.setState({ loading: false });
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
    const { address, username, avatarURL, email, uid, password } = this.state;
    const userRef = firebase.database().ref("/users");

    userRef.child(uid).set({
      email: email,
      address: address,
      username: username,
      profileImage: avatarURL,
      password: password
    });

    this.setState({ loading: false });
    this.props.history.push("/home");
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
            {this.state.isUploading && (
              <FormText>Progress: {this.state.progress}</FormText>
            )}
            {this.state.avatarURL && (
              <img
                style={{
                  width: 250,
                  height: 250,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 250 / 2
                }}
                src={this.state.avatarURL}
              />
            )}
          </Row>
          <Row style={{ padding: 20 }} className="justify-content-center">
            <strong>{username}</strong>
          </Row>
          <Row className="justify-content-center">
            <Col md="6">
              <Card className="mx-4">
                <CardBody className="p-4">
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
                    Please select your awesome looking pic...
                  </FormText>

                  <Button onClick={this._create_account} color="success" block>
                    Update Settings
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

export default UserUpdate;
