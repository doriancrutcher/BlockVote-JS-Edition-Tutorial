import React, { useRef, useState } from "react";
import { Container, Form, Button, Row, Col, Card } from "react-bootstrap";

const NewPoll = (props) => {
  const candidateName1 = useRef();
  const candidateName2 = useRef();

  const candidateName1URL = useRef();
  const candidateName2URL = useRef();

  const promptRef = useRef();

  const [disableButton, changeDisable] = useState(false);
  const [displayMessage, changeDisplayMessage] = useState(false);

  const sendToBlockChain = async () => {
    changeDisable(true);

    // async viewMethod({ contractId, method, args = {} }) {

    // async callMethod({ contractId, method, args = {}, gas = THIRTY_TGAS, deposit = NO_DEPOSIT })

    await props
      .callMethod("addCandidatePair", {
        prompt: promptRef.current.value,
        name1: candidateName1.current.value,
        name2: candidateName2.current.value,
        url1: candidateName1URL.current.value,
        url2: candidateName2URL.current.value,
      })
      .then(
        async () =>
          await props.callMethod("addToPromptArray", {
            prompt: promptRef.current.value,
          })
      )
      .then(async () => {
        await props.callMethod("initializeVotes", {
          prompt: promptRef.current.value,
        });
        return false;
      })
      .then(async () => {
        props.changePromptList(await props.getPrompts());
      });
  };

  const updatePolls = async () => {
    await sendToBlockChain().then(changeDisplayMessage(true));
  };

  const returnToHome = () => {
    if (displayMessage) {
      return (
        <Row className='justify-content-center d-flex'>
          <Card style={{ width: "20vw" }}>Return to Home Page</Card>
        </Row>
      );
    }
  };

  return (
    <Container style={{ marginTop: "10px" }}>
      {returnToHome()}
      <Row>
        <Card>
          <Card.Body>
            <Card.Title>Voting Prompt</Card.Title>
            <Form>
              <Form.Group className='mb-3'>
                <Form.Label>Prompt</Form.Label>
                <Form.Control
                  ref={promptRef}
                  placeholder='Add Prompt'
                ></Form.Control>
              </Form.Group>
            </Form>
          </Card.Body>
        </Card>
      </Row>
      <Row style={{ marginTop: "5vh" }}>
        <Col className='justify-content-center d-flex'>
          <Card style={{ width: "18rem" }}>
            <Card.Body>
              <Card.Title>Candidate 1 Information</Card.Title>
              <Card.Subtitle className='mb-2 text-muted'>
                Enter your Information For your First Candidate
              </Card.Subtitle>
              <Form>
                <Form.Group className='mb-3'>
                  <Form.Label>Candidiate 1 Name</Form.Label>
                  <Form.Control
                    ref={candidateName1}
                    placeholder='Enter Candidate Name'
                  ></Form.Control>
                </Form.Group>

                <Form.Group className='mb-3'>
                  <Form.Label>Candidate 1 Image URL</Form.Label>
                  <Form.Control
                    ref={candidateName1URL}
                    placeholder='enter Image URL'
                  ></Form.Control>
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col className='justify-content-center d-flex'>
          <Card style={{ width: "18rem" }}>
            {" "}
            <Card.Body>
              <Card.Title>Candidate 2 Information</Card.Title>
              <Card.Subtitle className='mb-2 text-muted'>
                Enter your Information For your First Candidate
              </Card.Subtitle>
              <Form>
                <Form.Group className='mb-3'>
                  <Form.Label>Candidiate 2 Name</Form.Label>
                  <Form.Control
                    ref={candidateName2}
                    placeholder='Enter Candidate Name'
                  ></Form.Control>
                </Form.Group>

                <Form.Group className='mb-3'>
                  <Form.Label>Candidate 2 Image URL</Form.Label>
                  <Form.Control
                    ref={candidateName2URL}
                    placeholder='enter Image URL'
                  ></Form.Control>
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row style={{ marginTop: "10vh" }}>
        <Button
          disabled={disableButton}
          onClick={updatePolls}
          variant='primary'
        >
          Submit
        </Button>
        {/* async callMethod({ contractId, method, args = {}, gas = THIRTY_TGAS, deposit = NO_DEPOSIT }) {
    // Sign a transaction with the "FunctionCall" action
    return await this.wallet.signAndSendTransaction({
      signerId: this.accountId,
      receiverId: contractId,
      actions: [
        {
          type: 'FunctionCall',
          params: {
            methodName: method,
            args,
            gas,
            deposit,
          },
        },
      ],
    });
  } */}
      </Row>
    </Container>
  );
};

export default NewPoll;
