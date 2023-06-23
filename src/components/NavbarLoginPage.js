import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {Dropdown } from "react-bootstrap";
class NavbarLoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDropdownOpen: false,
    };
  }

  handleDropdownToggle = () => {
    this.setState((prevState) => ({
      isDropdownOpen: !prevState.isDropdownOpen,
    }));
  };

  handleLogout = () => {
    localStorage.removeItem('firstname');
    this.props.history.push('/login');
  };


  render() {
    const { isDropdownOpen } = this.state;
    const { location } = this.props;
    const isLoggedIn = location.pathname !== '/login';
    const firstname = localStorage.getItem("firstname");

    return (
      
      <div>
        <header className="main-header position-fixed w-100">
          <link
            rel="stylesheet"
            href="../assets/libs/OwlCarousel-2/dist/assets/owl.carousel.min.css"
          />
          <link rel="stylesheet" href="../dist/css/iconfont/tabler-icons.css" />
          <link rel="stylesheet" href="../dist/css/style.css" />

          <div className="container">
            <nav className="navbar navbar-expand-xl py-0">
              <div className="logo">
                <a className="navbar-brand py-0 me-0" href="/">
                <img src="../assets/images/mesa/mesa.png" alt="" 
                style={{ width: "350px", height: "100px" }} />
                </a>
              </div>
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <i className="ti ti-menu-2 text-warning" />

              </button>
              <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav me-auto">
                  <li className="nav-item"></li>
                  
           
                </ul>
                <div className="d-flex align-items-center ms-auto">
                  {(location.pathname === '/files' ||
                    location.pathname === '/userdetails' ||
                    location.pathname === '/userlog' ||
                    location.pathname === '/groups') && (
                              <ul className="navbar-nav ms-auto">
                        <li className="nav-item dropdown">
                          <div className="dropdown" style={{ marginRight: '10px'}}>
                            {isLoggedIn && (
                              <Dropdown align="end">
                                <Dropdown.Toggle id="dropdown-button-dark-example1" variant="danger">
                                  {firstname}
                                </Dropdown.Toggle>

                                <Dropdown.Menu style={{backgroundColor: 'gray'}} show={isDropdownOpen}>
                                  
                                  <Dropdown.Item onClick={() => this.props.history.push("/userdetails")}>User Info
                                  </Dropdown.Item>
                                  <Dropdown.Item onClick={() => this.props.history.push("/userlog")}>User Log</Dropdown.Item>
                                  <Dropdown.Item  onClick={this.handleLogout}>Logout</Dropdown.Item>
                                </Dropdown.Menu>
                              </Dropdown>
                            )}
                          </div>
                        </li>
                      </ul>
                    )}
                  <div className="input-group search"></div>
                </div>

              </div>
            </nav>
          </div>
        </header>
      </div>
      
    );
  }
}

export default withRouter(NavbarLoginPage);
