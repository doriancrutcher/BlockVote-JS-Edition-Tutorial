import { Near } from "near-api-js";
import React, { useEffect, useState } from "react";
import { Table, Container, Button, Row } from "react-bootstrap";
let contractId = process.env.CONTRACT_NAME;
console.log(contractId);

const Home = (props) => {
  const [promptList, changePromptList] = useState([
    "Which Pokemon is Best?",
    "Which city is best",
  ]);

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
        </Button>
      </Row>
    </Container>
  );
};

export default Home;
