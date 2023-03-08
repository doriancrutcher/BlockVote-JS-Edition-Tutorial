// imports
// worker - lets me make a sandbox instance for deployment and testing operations
// nearAccount - lets me create and manage test accounts

// anyTest and TestFn let me define  and run test in ava
import { Worker, NearAccount } from "near-workspaces";
import anyTest, { TestFn } from "ava";

const test = anyTest as TestFn<{
  worker: Worker;
  accounts: Record<string, NearAccount>;
}>;

let promptVal: string;
let can1: string;
let can2: string;
let url1: string;
let url2: string;

// things to be done before the test begin
test.beforeEach(async (t) => {
  // Init the worker and start a Sandbox server
  const worker = await Worker.init();

  //Set Variable Values
  promptVal = "testPoll";
  can1 = "Pencil";
  can2 = "Pen";
  url1 = "url1";
  url2 = "url2";

  // Deploy contract
  const root = worker.rootAccount;
  const contract = await root.createSubAccount("test-account");
  // Get wasm file path from package.json test script in folder above
  await contract.deploy(process.argv[2]);

  // Save state for test runs, it is unique for each test
  t.context.worker = worker;
  t.context.accounts = { root, contract };
});

test.afterEach.always(async (t) => {
  // Stop Sandbox server
  await t.context.worker.tearDown().catch((error) => {
    console.log("Failed to stop the Sandbox:", error);
  });
});

test("initializes new vote array for a given prompt", async (t) => {
  const { root, contract } = t.context.accounts;
  await root.call(contract, "initializeVotes", { prompt: promptVal });
  const poll = await contract.view("getVotes", { prompt: promptVal });
  t.deepEqual(poll, [0, 0], "Vote array not initialized properly");
});

test("add candidate pair for the given prompt ", async (t) => {
  const { root, contract } = t.context.accounts;
  await root.call(contract, "addCandidatePair", {
    prompt: promptVal,
    name1: can1,
    name2: can2,
    url1: url1,
    url2: url2,
  });
  const candidatePairVal = await contract.view("getCandidatePair", {
    prompt: promptVal,
  });
  t.deepEqual(
    candidatePairVal,
    [can1, can2],
    "Incorrect Candidate Pair retreived"
  );
});

test("add a vote to the given prompt and check user participation", async (t) => {
  const { root, contract } = t.context.accounts;

  // Add vote
  await root.call(contract, "addVote", { prompt: promptVal, index: 0 });
  const votes = await contract.view("getVotes", { prompt: promptVal });
  t.deepEqual(votes, [1, 0], "Vote not added properly");

  // Check user participation
  const user = "user1";
  await root.call(contract, "recordUser", { prompt: promptVal, user });
  const participated = await contract.view("didParticipate", {
    prompt: promptVal,
    user,
  });
  t.true(participated, "User participation not recorded properly");
});
