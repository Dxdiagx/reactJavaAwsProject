import React, {Component} from 'react';
import '../FileUpload.css';
import { withRouter } from 'react-router-dom';
import { Button } from 'react-bootstrap';

class LeftNavBar extends Component {


    render(){
        return(
            <div className="col-sm-9">

                <Button className="button" type="submit"
                        onClick={() => this.props.history.push("/userdetails")}>User Profile</Button>
                <br /><br /><br />
                <Button className="button" type="submit"
                        onClick={() => this.props.history.push("/userlog")}>
                    User Activity
                </Button>
                <br/>

            </div>

        )}

}


export default withRouter(LeftNavBar);