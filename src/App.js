import React from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DrawingPage from "./pages/DrawingPage";

const App = () => {
  return (
    <div className="app">
      <Router>
        <Switch>
          <Route exact path="/login">
            <LoginPage />
          </Route>
          <Route exact path="/">
            <DrawingPage />
          </Route>
        </Switch>
      </Router>
    </div>
  );
};

export default App;
