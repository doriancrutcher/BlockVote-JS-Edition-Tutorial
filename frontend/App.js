import "regenerator-runtime/runtime";
import React from "react";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Routes,
} from "react-router-dom";

import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

import "bootstrap/dist/css/bootstrap.min.css";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Button } from "react-bootstrap";

//Components
import Home from "./Components/Home";
import NewPoll from "./Components/NewPoll";
import PollingStation from "./Components/PollingStation";

export default function App({ isSignedIn, contractId, wallet }) {
  const callMethod = async (methodName, args = {}) => {
    wallet.callMethod({
      contractId: contractId,
      method: methodName,
      args: args,
    });
  };

  const viewMethod = async (methodName, args = {}) => {
    return await wallet.viewMethod({
      contractId: contractId,
      method: methodName,
      args: args,
    });
  };

  const signInFun = () => {
    wallet.signIn();
  };

  const signOutFun = () => {
    wallet.signOut();
  };

  const changeCandidatesFunction = async (prompt) => {
    console.log(prompt);
    let namePair = await viewMethod("getCandidatePair", { prompt: prompt });
    await localStorage.setItem("Candidate1", namePair[0]);
    await localStorage.setItem("Candidate2", namePair[1]);
    await localStorage.setItem("prompt", prompt);
    window.location.replace(window.location.href + "PollingStation");
  };

  return (
    <Router>
      <Navbar collapseOnSelect expand='lg' bg='dark' variant='dark'>
        {console.log(isSignedIn)}
        <Container>
          <Navbar.Brand href='/'>
            <img src={"https://i.imgur.com/31dvjnh.png"}></img>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls='responsive-navbar-nav' />
          <Navbar.Collapse id='responsive-navbar-nav'>
            <Nav className='mx-auto'></Nav>
            <Nav>
              <Nav.Link href='/newpoll'>New Poll</Nav.Link>
              <Nav.Link onClick={isSignedIn ? signOutFun : signInFun}>
                {isSignedIn ? wallet.accountId : "Login"}
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Routes>
        <Route
          path='/'
          element={
            <Home
              wallet={wallet}
              callMethod={callMethod}
              viewMethod={viewMethod}
              changeCandidates={changeCandidatesFunction}
            />
          }
        ></Route>
        <Route
          path='/newpoll'
          element={
            <NewPoll
              wallet={wallet}
              callMethod={callMethod}
              viewMethod={viewMethod}
            />
          }
        ></Route>
        <Route
          path='/pollingstation'
          element={
            <PollingStation
              wallet={wallet}
              callMethod={callMethod}
              viewMethod={viewMethod}
            />
          }
        ></Route>
      </Routes>
    </Router>
  );
}
