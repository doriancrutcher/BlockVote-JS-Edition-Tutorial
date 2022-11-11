# Block Vote JS Edition

Welcome to BlockVote! The application where a user can propose a prompt to vote on, then vote for one of two candidates!

This app is meant to demonstrate how to create a full dApp starting from `create-near-app`, and also demonstrate how to implement collections and initiate a JS smart contract using the near-sdk-js!

This app was initialized with [create-near-app]

# Quick Start

If you haven't installed dependencies during setup:

    npm install

Build and deploy your contract to TestNet with a temporary dev account:

    npm run deploy

Test your contract:

    npm run start

# Exploring The Code

1. The smart-contract code lives in the `/contract` folder. There you will find the functionality implemented to store votes, store user names per prompt and store the prompt names to vote on

2. The frontend code lives in the `/frontend` folder. `/frontend/index.html` is a great
   place to start exploring. Note that it loads in `/frontend/index.js`,
   this is your entrypoint to learn how the frontend connects to the NEAR blockchain.

# Deploy

Every smart contract in NEAR has its [own associated account][near accounts].
When you run `npm run deploy`, your smart contract gets deployed to the live NEAR TestNet with a temporary dev account.
When you're ready to make it permanent, here's how:

## Step 0: Install near-cli (optional)

[near-cli] is a command line interface (CLI) for interacting with the NEAR blockchain. It was installed to the local `node_modules` folder when you ran `npm install`, but for best ergonomics you may want to install it globally:

    npm install --global near-cli

Or, if you'd rather use the locally-installed version, you can prefix all `near` commands with `npx`

Ensure that it's installed with `near --version` (or `npx near --version`)

## Step 1: Create an account for the contract

Each account on NEAR can have at most one contract deployed to it. If you've already created an account such as `your-name.testnet`, you can deploy your contract to `near-blank-project.your-name.testnet`. Assuming you've already created an account on [NEAR Wallet], here's how to create `near-blank-project.your-name.testnet`:

1. Authorize NEAR CLI, following the commands it gives you:

   near login

2. Create a subaccount (replace `YOUR-NAME` below with your actual account name):

   near create-account near-blank-project.YOUR-NAME.testnet --masterAccount YOUR-NAME.testnet

## Step 2: deploy the contract

Use the CLI to deploy the contract to TestNet with your account ID.
Replace `PATH_TO_WASM_FILE` with the `wasm` that was generated in `contract` build directory.

    near deploy --accountId near-blank-project.YOUR-NAME.testnet --wasmFile PATH_TO_WASM_FILE

## Step 3: set contract name in your frontend code

Modify the line in `src/config.js` that sets the account name of the contract. Set it to the account id you used above.

    const CONTRACT_NAME = process.env.CONTRACT_NAME || 'near-blank-project.YOUR-NAME.testnet'

# Troubleshooting

On Windows, if you're seeing an error containing `EPERM` it may be related to spaces in your path. Please see [this issue](https://github.com/zkat/npx/issues/209) for more details.

[create-near-app]: https://github.com/near/create-near-app
[node.js]: https://nodejs.org/en/download/package-manager/
[jest]: https://jestjs.io/
[near accounts]: https://docs.near.org/concepts/basics/account
[near wallet]: https://wallet.testnet.near.org/
[near-cli]: https://github.com/near/near-cli
[gh-pages]: https://github.com/tschaub/gh-pages

# BlockVote-JS-Edition-Tutorial
