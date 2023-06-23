import React, { Component } from "react";
import * as API from "../api/API";
import FileGridList from "./FileGridList";
import { connect } from "react-redux";
import { addFile } from "../actions/index";
import { deleteFile } from "../actions/index";
import RightNavBar from "./RightNavBar";
import { afterlogin } from "../actions/index";
import { getFiles } from "../actions/index";
import { sharedCount } from "../actions/index";
import { withRouter } from "react-router-dom";
import backImage from "./back.png";
import { Form, Nav } from "react-bootstrap";
import NavbarLoginPage from "./NavbarLoginPage";
import uploadImage from "./upload.gif";
import * as alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.css";

class FileUpload extends Component {
  state = {
    fileparent: "",
  };

  componentDidMount() {
    API.getUserDetails().then((userres) => {
      if (userres.status == 200) {
        userres
          .json()
          .then((userdata) => {
            localStorage.setItem("firstname", userdata.firstname);
            this.props.afterlogin(userdata);
          })
          .then(() => {
            API.getFilesForUser().then((fileres) => {
              if (fileres.status == 200) {
                fileres.json().then((files) => {
                  this.props.getFiles(files);
                });
                console.log("Success...");
              } else if (fileres.status == 401) {
                this.props.history.push("/");
              }
            });
          });
      } else if (userres.status == 401) {
        this.props.history.push("/");
      }
    });
  }

  handleFileUpload = (event) => {
    const payload = new FormData();
    const file = event.target.files[0];
    const key = this.state.fileparent;

    payload.append("file", file);
    payload.append("key", key);

    console.log(key);

    API.uploadFile(file, key).then((res) => {
      if (res.status === 200) {
        res.json().then((filedata) => {
          this.props.addFile(filedata);
        });
        alertify.success("File uploaded successfully");
      } else if (res.status === 401) {
        alertify.error("File Error");
      }
    });
  };

  deleteFile = (index, file) => {
    API.deleteFile(file).then((res) => {
      console.log(res);
      if (res.status == 200) {
        console.log("Delete success");
        this.props.deleteFile(index);

        alertify.success("File deleted successfully!");
      } else if (res.status == 401) {
        alertify.error("Error deleting file!");
      }
    });
  };

  makeFolder = (folder) => {
    API.makeFolder(folder).then((res) => {
      console.log(folder);
      if (res.status == 200) {
        res.json().then((folder) => {
          this.props.addFile(folder);

          alertify.success("folder created successfully");
        });
      } else if (res.status == 401) {
        alertify.error("Error creating folder!");
      }
    });
  };

  sharefile = (filedata) => {
    var emailList = filedata.shareEmail.trim().split(";");

    for (var key in emailList) {
      const data = { filedata: filedata.file, shareEmail: emailList[key] };

      API.shareFile(data).then((res) => {
        if (res.status == 200) {
          console.log("dataaa..", data);
          if (!filedata.index)
            filedata.index = this.props.filesdata.files.length - 1;
          this.props.sharedCount(filedata.index, data.filedata.sharedcount + 1);

          alertify.success("File Shared with" + data.shareEmail);
          console.log("Success...");
        } else if (res.status == 401) {
          alertify.error(data.shareEmail + " " + "does not exist!");
        }
      });
    }
  };

  sharefileingroup = (data) => {
    API.shareFileInGroup(data).then((res) => {
      if (res.status == 201) {
        this.props.sharedCount(data.index, res.sharedcount);
        alertify.success("File Shared with" + data.group + "group!");

        console.log("Success...");
      } else if (res.status == 401) {
        alertify.error(data.group + "does not exist!");
      }
    });
  };

  downloadLink = (filedata) => {
    API.downloadLink(filedata).then((res) => {
      if (res.status == 201) {
        console.log("Success...");
      } else if (res.status == 401) {
        alertify.error("Failed");
      }
    });
  };

  makeSharedFolder = (data) => {
    console.log(data);
    API.makeFolder(data).then((res) => {
      if (res.status == 200) {
        res.json().then((folder) => {
          console.log(folder);
          // data.filepath=folder;
          this.props.addFile(folder);
          const shareddata = { file: folder, shareEmail: data.shareEmail };
          this.sharefile(shareddata);
          alertify.success("folder created successfully");
        });
      } else if (res.status == 401) {
        alertify.error("Folder error");
      }
    });
  };

  openFileFolder = (filedata) => {
    console.log(filedata);
    if (filedata.isfile == "F") {
      this.setState({
        fileparent: filedata.filepath,
      });
      console.log(this.state.fileparent);

      API.getFileList(filedata.filepath).then((res) => {
        if (res.status == 200) {
          res.json().then((files) => {
            this.props.getFiles(files);
          });

          console.log("Success...");
        } else if (res.status == 401) {
          console.log("Failure...");
        }
      });
    } else {
      API.getFile(filedata.filepath).then((res) => {
        console.log("hello");
        console.log(res);
      });
    }
  };

  navigateHome() {
    API.getFilesForUser().then((fileres) => {
      if (fileres.status == 200) {
        fileres.json().then((files) => {
          this.props.getFiles(files);
          this.setState({
            fileparent: "",
          });
        });

        console.log("Success...");
      } else if (fileres.status == 401) {
        this.props.history.push("/");
      }
    });
  }

  render() {
    console.log(this.state.fileparent);
    return (
      <div className="container-fluid hero-banner">
        <div>
          <NavbarLoginPage />
        </div>

        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />

        <div className="container-fluid">
          <div>
            <Nav className="container-fluid">
              <div className="container-fluid">
                <div className="row-md-12">
                  <div className="col-md-12"></div>
                </div>
              </div>
            </Nav>
          </div>

          <div className="container">
            <div className="row">
              <div className="col-sm-12">
                <RightNavBar
                  makeFolder={this.makeFolder}
                  makeSharedFolder={this.makeSharedFolder}
                  parentFile={this.state.fileparent}
                />
              </div>
            </div>

            <div className="col-md-12" onClick={() => this.navigateHome()}>
              <img
                className="back.png"
                src={backImage}
                alt="back"
                height="30"
                width="30"
                style={{ cursor: "pointer" }}
              />
            </div>

            <div className="row">
              <div className="col-sm-6">
                <FileGridList
                  deleteFile={this.deleteFile}
                  sharefileingroup={this.sharefileingroup}
                  sharefile={this.sharefile}
                  openFileFolder={this.openFileFolder}
                  parentFile={this.state.fileparent}
                  downloadLink={this.state.downloadLink}
                />
              </div>

              <div className="col-sm-6">
                <Form.Group>
                  <div
                    onClick={() => {
                      const fileInput = document.getElementsByName("mypic")[0];
                      if (fileInput) fileInput.click();
                    }}
                  >
                    <img
                      className="upload-image"
                      src={uploadImage}
                      alt="upload"
                      style={{ width: "300px", height: "300px" }}
                    />
                  </div>
                  <input
                    type="file"
                    name="mypic"
                    onChange={(event) => {
                      this.handleFileUpload(event);
                      event.target.value = null; // Dosya seçildikten sonra input değerini temizler
                    }}
                    style={{ display: "none" }}
                  />
                </Form.Group>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(reducerdata) {
  console.log(reducerdata);

  const filesdata = reducerdata.filesreducer;
  return { filesdata };
}

function mapDispatchToProps(dispatch) {
  return {
    addFile: (data) => dispatch(addFile(data)),
    deleteFile: (index) => dispatch(deleteFile(index)),
    afterlogin: (data) => dispatch(afterlogin(data)),
    getFiles: (data) => dispatch(getFiles(data)),
    sharedCount: (index, data) => dispatch(sharedCount(index, data)),
  };
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(FileUpload)
);
