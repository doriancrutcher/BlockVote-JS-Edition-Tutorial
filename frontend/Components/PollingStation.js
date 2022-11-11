import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
// import LoadingCircles from "../assets/loadingcircles.svg";

const PollingStation = (props) => {
  const [candidate1URL, changeCandidate1Url] = useState(
    "https://cdn2.iconfinder.com/data/icons/material-line-thin/1024/option-256.png"
  );
  const [candidate2URL, changeCandidate2Url] = useState(
    "https://cdn2.iconfinder.com/data/icons/material-line-thin/1024/option-256.png"
  );
  const [showresults, changeResultsDisplay] = useState(false);
  const [buttonStatus, changeButtonStatus] = useState(false);
  const [candidate1Votes, changeVote1] = useState(0);
  const [candidate2Votes, changeVote2] = useState(0);
  const [prompt, changePrompt] = useState("--");

  const contractId = process.env.CONTRACT_NAME;

  useEffect(() => {
    const getInfo = async () => {
      let x = "localStorage";
      console.log("the prompt is", localStorage.prompt);
      // vote count stuff

      let promptName = localStorage.prompt;

      let voteCount = await props.viewMethod("getVotes", {
        prompt: promptName,
      });

      console.log(voteCount);
      changeVote1(voteCount[0]);
      changeVote2(voteCount[1]);

      // // image stuff

      changeCandidate1Url(
        await props.viewMethod("getUrl", {
          name: localStorage.getItem("Candidate1"),
        })
      );
      changeCandidate2Url(
        await props.viewMethod("getUrl", {
          name: localStorage.getItem("Candidate2"),
        })
      );

      changePrompt(localStorage.getItem("prompt"));

      // // vote checking stuff

      let didUserVote = await props.viewMethod("didParticipate", {
        prompt: localStorage.getItem("prompt"),
        user: props.wallet.accountId,
      });
      console.log(didUserVote);

      await changeResultsDisplay(didUserVote);
      await changeButtonStatus(didUserVote);
    };

    getInfo();
  }, []);

  const addVote = async (index) => {
    changeButtonStatus(true);
    let receipt = await props
      .callMethod("addVote", {
        prompt: localStorage.getItem("prompt"),
        index: index,
      })
      .then(async () => {
        await props.callMethod("recordUser", {
          prompt: localStorage.getItem("prompt"),
          user: props.wallet.accountId,
        });
      })
      .then(async () => {
        let voteCount = await props.viewMethod("getVotes", {
          prompt: localStorage.getItem("prompt"),
        });
        return voteCount;
      })
      .then((voteCount) => {
        changeVote1(voteCount[0]);
        changeVote2(voteCount[1]);
        console.log(voteCount);
      });

    changeResultsDisplay(true);

    alert("thanks for voting!");
  };

  return (
    <Container>
      <Row>
        <Col className='jutify-content-center d-flex' style={{ width: "20vw" }}>
          <Container>
            <Row style={{ marginTop: "5vh", backgroundColor: "#c4c4c4" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  padding: "3vw",
                }}
              >
                <img
                  style={{
                    height: "35vh",
                    width: "20vw",
                  }}
                  src={candidate1URL}
                ></img>
              </div>
            </Row>
            {showresults ? (
              <Row
                className='justify-content-center d-flex'
                style={{ marginTop: "5vh" }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    fontSize: "8vw",
                    padding: "10px",
                    backgroundColor: "#c4c4c4",
                  }}
                >
                  {candidate1Votes}
                </div>
              </Row>
            ) : null}
            <Row
              style={{ marginTop: "5vh" }}
              className='justify-content-center d-flex'
            >
              <Button disabled={false} onClick={() => addVote(0)}>
                Vote
              </Button>
            </Row>
          </Container>
        </Col>
        <Col
          className='justify-content-center d-flex align-items-center'
          style={{ width: "10vw" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              backgroundColor: "#c4c4c4",
              height: "20vh",
              alignItems: "center",
              padding: "2vw",
              textAlign: "center",
            }}
          >
            {prompt}
          </div>
        </Col>
        <Col className='jutify-content-center d-flex' style={{ width: "20vw" }}>
          <Container>
            <Row style={{ marginTop: "5vh", backgroundColor: "#c4c4c4" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  padding: "3vw",
                }}
              >
                <img
                  style={{
                    height: "35vh",
                    width: "20vw",
                  }}
                  src={candidate2URL}
                ></img>
              </div>
            </Row>
            {showresults ? (
              <Row
                className='justify-content-center d-flex'
                style={{ marginTop: "5vh" }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    fontSize: "8vw",
                    padding: "10px",
                    backgroundColor: "#c4c4c4",
                  }}
                >
                  {candidate2Votes}
                </div>
              </Row>
            ) : null}
            <Row
              style={{ marginTop: "5vh" }}
              className='justify-content-center d-flex'
            >
              <Button disabled={buttonStatus} onClick={() => addVote(1)}>
                Vote
              </Button>
            </Row>
          </Container>
        </Col>
      </Row>
    </Container>
  );
};

export default PollingStation;
