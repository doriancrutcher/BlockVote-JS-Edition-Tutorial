import { Near } from "near-api-js";
import React, { useEffect, useState } from "react";
import { Table, Container, Button, Row, Card } from "react-bootstrap";
import { async } from "regenerator-runtime";
let contractId = process.env.CONTRACT_NAME;
console.log(contractId);

const Home = (props) => {
  const [disableButton, changeDisableButton] = useState(false);

  useEffect(() => {
    console.log("loading prompts");
    const getInfo = async () => {
      let output = await props.getPrompts();
      props.changePromptList(output);
      if (output.length === 0) {
        changeDisableButton(true);
      }
    };
    getInfo();
  }, []);

  const clearPolls = async () => {
    await props.callMethod("clearPromptArray");
    changeDisableButton(true);
    alert("Please Reload the Page");
  };

  const addPrompt = async () => {
    await props.callMethod("addToPromptArray", {
      prompt: "dorian",
    });
    console.log("adding prompt");
  };

  return (
    <Container>
      <Table style={{ margin: "5vh" }} striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>List of Polls</th>
            <th>Go to Poll</th>
          </tr>
        </thead>
        <tbody>
          {props.promptList.map((el, index) => {
            console.log(props.promptList);
            if (props.promptList) {
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{el}</td>
                  <td>
                    {" "}
                    <Button onClick={() => props.changeCandidates(el)}>
                      Go to Poll
                      {console.log(el)}
                    </Button>
                  </td>
                </tr>
              );
            } else {
              <tr>
                <td> no prompts</td>
              </tr>;
            }
          })}
        </tbody>
      </Table>
      {
        <Row className='justify-content-center d-flex'>
          <Card style={{ width: "20vw", height: "10vh" }}>
            No Prompts to show
          </Card>
        </Row>
      }
      <Row>
        <Button
          style={{
            width: "20vh",
            marginLeft: "10vh",
          }}
          onClick={clearPolls}
          disabled={disableButton}
        >
          {" "}
          Clear Polls
        </Button>{" "}
      </Row>
    </Container>
  );
};

export default Home;
