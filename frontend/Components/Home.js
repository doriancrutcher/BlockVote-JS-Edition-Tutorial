import { Near } from "near-api-js";
import React, { useEffect, useState } from "react";
import { Table, Container, Button, Row } from "react-bootstrap";
let contractId = process.env.CONTRACT_NAME;
console.log(contractId);

const Home = (props) => {
  const [promptList, changePromptList] = useState([]);

  useEffect(() => {
    const getPrompts = async () => {
      let output = await props.viewMethod("getAllPrompts");
      console.log("output is", output);
      changePromptList(output);
    };

    getPrompts();
  }, []);

  const clearPolls = async () => {
    await props.callMethod("clearPromptArray");
    location.reload();
  };

  const getPrompts = async () => {
    console.log(await props.viewMethod("getAllPrompts"));
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
          {promptList.map((el, index) => {
            console.log(promptList);
            if (promptList) {
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
      <Row>
        <Button
          style={{
            width: "20vh",
            marginLeft: "10vh",
          }}
          onClick={clearPolls}
        >
          {" "}
          Clear Polls
        </Button>{" "}
      </Row>
    </Container>
  );
};

export default Home;
