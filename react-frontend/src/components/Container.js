import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import * as API from "../api/API";
import "../Login.css";
import SignUp from "./SignUp";
import Login from "./Login";
import * as alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.css";

class Container extends Component {
  state = {
    login: "SI",
  };

  login = (userdata) => {
    API.doLogin(userdata).then((res) => {
      if (res.status == 200) {
        this.props.history.push("/files");
      } else if (res.status == 401) {
        alertify.error("Wrong username or password. Try again..!!");
      }
    });
  };

  loginOrSignup = (data) => {
    console.log(data);
    this.setState({
      login: data,
    });
  };

  signUp = (userdata) => {
    console.log(userdata);
    API.createUser(userdata).then((res) => {
      if (res.status == 201) {
        alertify.success("User details saved successfully!");
      } else if (res.status == 401) {
        alertify.error("Email already exists!");
      }
    });
  };

  render() {
    return (
      <div className="container-fluid hero-banner">
        <br /> <br />
        {this.state.message === "" ? (
          ""
        ) : (
          <div className="text-danger">{this.state.message}</div>
        )}
        <div className="account-wall">
          <div className="col-md-12">
            {this.state.login === "SU" ? (
              <SignUp signUp={this.signUp} loginOrSignup={this.loginOrSignup} />
            ) : (
              <Login login={this.login} loginOrSignup={this.loginOrSignup} />
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Container);
