import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { Component } from "react";
import { BrowserRouter as Router, Route,Switch} from "react-router-dom";
import Homepage from "./components/Homepage";
import NewerHomePage from "./components/NewerHomePage";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Router>
          <Switch>
            <Route exact path="/" component={Homepage} />
            <Route path="/" component={NewerHomePage} />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
