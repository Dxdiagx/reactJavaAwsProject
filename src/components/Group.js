import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import '../FileUpload.css';
import ListGroup from './ListGroup';
import 'react-table/react-table.css';
import GroupRightNavBar from './GroupRightNavBar';
import MemberRightNavBar from './MemberRightNavBar';
import ListMembers from './ListMembers';
import LeftNavBar from './LeftNavBar';
import NavbarLoginPage from './NavbarLoginPage';

class Group extends Component {
  state = {
    index: '',
    group: '',
    entergroup: ''
  };

  openGroup = (groupdata) => {
    console.log(groupdata);
    this.setState({ group: groupdata, entergroup: 'T' });
  };

  navigatetogroups = () => {
    this.setState({ entergroup: '' });
  };

  navigateToFiles = () => {
    this.props.history.push('/files');
  };

  render() {
    console.log(this.state.group.members);
    return (
      <div className="hero-banner position-300px overflow-hidden"> 
       <NavbarLoginPage />
        <br />
        <br />  <br />  <br />  <br />  <br />  <br />  <br />
        <div className="container">
          <div className="row">
            <div className="col-sm-2">
              <LeftNavBar />
            </div>
            <div className="col-sm-7">
              {this.state.entergroup === '' ? (
                <ListGroup openGroup={this.openGroup} />
              ) : (
                <ListMembers group={this.state.group} />
              )}
            </div>
            <div className="col-sm-3">
              {this.state.entergroup === '' ? (
                <GroupRightNavBar />
              ) : (
                <MemberRightNavBar
                  index={this.state.index}
                  group={this.state.group}
                  navigatetogroups={this.navigatetogroups}
                />
              )}
            </div>
          </div>
        </div>
      </div>
   
    );
  }
}

export default withRouter(Group);
