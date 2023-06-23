import React, { Component } from "react";
import "../FileUpload.css";
import Modal from "react-modal";
import { Row, Col, ListGroupItem, Button } from "react-bootstrap";
import { withRouter } from "react-router-dom";

class RightNavBar extends Component {
  state = {
    isModalOpen: false,
    filename: "",
    fileparent: "",
    isfile: "F",
    shareEmail: "",
    clickSharedFolder: false,
  };

  openModal() {
    this.setState({ isModalOpen: true, fileparent: this.props.parentFile });
  }

  closeModal(data) {
    console.log(data);

    {
      data != ""
        ? data.filename != ""
          ? data.shareEmail != ""
            ? this.props.makeSharedFolder(data)
            : this.props.makeFolder(data)
          : ""
        : "";
    }

    this.setState({ isModalOpen: false, clickSharedFolder: false });
  }

  openSharedFolderModal() {
    this.setState({ isModalOpen: true, clickSharedFolder: true });
  }

  style = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };

  render() {
    console.log(this.props.parentFile);
    return (
      <div className="row">
        <div className="col-sm-12">
          <div className="row">
            {this.props.parentFile === "" ? (
              <div className="col-sm-2">
                <div className="text-center">
                  {" "}
                  {/* Yeni eklenen div */}
                  <Button
                    className="btn btn-primary btn-lg btn-block"
                    type="submit"
                    onClick={() => this.openSharedFolderModal()}
                  >
                    New Shared Folder
                  </Button>
                </div>
              </div>
            ) : (
              ""
            )}
            <div className="col-sm-2">
              <Button
                className="btn btn-primary btn-block"
                type="submit"
                onClick={() => this.openModal()}
              >
                New Folder
              </Button>
            </div>
            <div className="col-sm-2">
              <Button
                className="btn btn-primary btn-block"
                type="submit"
                onClick={() => this.props.history.push("/groups")}
              >
                Groups
              </Button>
            </div>
          </div>
        </div>

        <Modal
          isOpen={this.state.isModalOpen}
          style={this.style}
          onClose={() => this.closeModal()}
        >
          <ListGroupItem>
            <Row>
              <Col md={4}>FolderName:</Col>
              <Col md={8}>
                <input
                  type="text"
                  className="form-control"
                  required="true"
                  autoFocus
                  onChange={(event) => {
                    this.setState({
                      filename: event.target.value,
                    });
                  }}
                />
              </Col>
            </Row>
            <br />
            {this.state.clickSharedFolder == true ? (
              <Row>
                <Col md={4}>Share With Email:</Col>
                <Col md={8}>
                  <input
                    type="email"
                    className="form-control"
                    required="true"
                    placeholder="Enter (;) separated emails"
                    onChange={(event) => {
                      this.setState({
                        shareEmail: event.target.value,
                      });
                    }}
                  />
                </Col>
              </Row>
            ) : (
              ""
            )}
          </ListGroupItem>
          <br />
          <div className="row justify-content-md-center">
            <div className="col-md-4">
              <button
                className="btn btn-primary"
                type="submit"
                onClick={() => this.closeModal(this.state)}
              >
                Save
              </button>
            </div>
            <div className="col-md-4">
              <button
                className="btn btn-primary"
                type="submit"
                onClick={() => this.closeModal("")}
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default withRouter(RightNavBar);
