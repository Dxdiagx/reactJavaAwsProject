import React, { Component } from "react";
import { Route, withRouter } from "react-router-dom";
import "../Login.css";
import FileUpload from "./FileUpload";
import Container from "./Container";
import Group from "./Group";
import UserDetails from "./UserDetails";
import UserLog from "./UserLog";
import Price from "./price";
import NavbarLoginPage from "./NavbarLoginPage";

class NewerHomePage extends Component {
  handleLogin = () => {
    this.props.history.push("/");
  };

  render() {
    return (
      <div>
        <link
          rel="stylesheet"
          href="../assets/libs/OwlCarousel-2/dist/assets/owl.carousel.min.css"
        />
        <link rel="stylesheet" href="../dist/css/iconfont/tabler-icons.css" />
        <link rel="stylesheet" href="../dist/css/style.css" />
        <div>
          <Route
            exact
            path="/login"
            render={() => (
              <div className="d-flex justify-content-center align-items-center">
                <div>
                  <Container />
                </div>
              </div>
            )}
          />

          <Route
            exact
            path="/price"
            render={() => (
              <div>
                <Price />
              </div>
            )}
          />
          <Route exact path="/files" render={() => <FileUpload />} />
          <Route
            exact
            path="/userdetails"
            render={() => (
              <section className="hero-banner position-relative overflow-hidden">
                <UserDetails />
              </section>
            )}
          />

          <Route exact path="/userlog" render={() => <UserLog />} />

          <Route exact path="/groups" render={() => <Group />} />
        </div>
      </div>
    );
  }
}

export default withRouter(NewerHomePage);
