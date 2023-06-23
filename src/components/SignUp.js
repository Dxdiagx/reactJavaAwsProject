import React, {Component} from 'react';
import '../Login.css';
import * as alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.css';


class SignUp extends Component {


    state = {
        firstname:'',
        lastname:'',
        username: '',
        password: '',
        email:'',
        contact:''
    };


    render() {
        return (
            <div>
              <h2>Create an account</h2>
          
              <input
                type="text"
                className="form-control"
                placeholder="First Name"
                required
                autoFocus
                onChange={(event) => {
                  this.setState({
                    firstname: event.target.value,
                  });
                }}
              />
              <br />
              <input
                type="text"
                className="form-control"
                placeholder="Last Name"
                required
                onChange={(event) => {
                  this.setState({
                    lastname: event.target.value,
                  });
                }}
              />
          
              <br />
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                required
                onChange={(event) => {
                  this.setState({
                    email: event.target.value,
                  });
                }}
              />
              <br />
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                required
                onChange={(event) => {
                  this.setState({
                    password: event.target.value,
                  });
                }}
              />
          
              <br />
          
              <button
                className="btn btn-primary btn-block"
                type="submit"
                onClick={() => {
                  if (
                    !this.state.firstname ||
                    !this.state.lastname ||
                    !this.state.email ||
                    !this.state.password
                  ) {
                    alertify.error('Please fill in all fields');
                    return;
                  }
                  this.props.signUp(this.state);
                }}
              >
                Save
              </button>
              <a
                href="#"
                className="text-center new-account"
                onClick={() => this.props.loginOrSignup("SI")}
              >
                Log In
              </a>
            </div>
          );
          
    }
}

export default SignUp;