# ECDSA Node

This project is an example of using a client and server to facilitate transfers between different addresses. Since there is just a single server on the back-end handling transfers, this is clearly very centralized. We won't worry about distributed consensus for this project.

However, something that we would like to incoporate is Public Key Cryptography. By using Elliptic Curve Digital Signatures we can make it so the server only allows transfers that have been signed for by the person who owns the associated address.

## Video instructions
For an overview of this project as well as getting started instructions, check out the following video:

https://www.loom.com/share/0d3c74890b8e44a5918c4cacb3f646c4
 
## Client

The client folder contains a [react app](https://reactjs.org/) using [vite](https://vitejs.dev/). To get started, follow these steps:

1. Open up a terminal in the `/client` folder
2. Run `npm install` to install all the depedencies
3. Run `npm run dev` to start the application 
4. Now you should be able to visit the app at http://127.0.0.1:5173/

## Server

The server folder contains a node.js server using [express](https://expressjs.com/). To run the server, follow these steps:

1. Open a terminal within the `/server` folder 
2. Run `npm install` to install all the depedencies 
3. Run `node index` to start the server 

The application should connect to the default server port (3042) automatically! 

_Hint_ - Use [nodemon](https://www.npmjs.com/package/nodemon) instead of `node` to automatically restart the server on any changes.

## Design Decisions 

For Oehmsmith's fork of this project.

1. Users - this is a simulation of multiple users in a browser and provides a logical way to switch between different users that have different wallets.  An input box was chosen over a dropdown since as an input it can double for the use of 'create' user
2. Wallet Connect - This is like a simulation of MetaMask etc... and each user has a collection of wallets.  Selecting the first of a user's wallets will require a login to the wallets
3. Dropdown containing all wallets in Transfer dialog.  This was decided upon instead of typing wallet addresses to make things simpler for users of this simple application.

## Alchemy University Submission

I wrote this description in the submission form.

I wanted to easily work with multiple users who can have multiple wallets.  I implemented a mock of multiple browser users like Chrome provides. Each user has a sandboxed environment that includes a Metamask or similar, each with its own password.  You can create dummy users with an initial wallet by pressing the 'dummy' button.  Or you can create users.  Then you can choose a user and then can select a wallet.  The first wallet selection for a user requests entering the password.  NOTE that no password is actually required in this mock - just press Submit.  From there you are able to transfer tokens from the chosen wallet to any others.  The 'any other wallets' to send to is in a drop-down to make it easier.  My initial instance has a bug where the chosen wallet is not cleared such as after choosing a new user.  I will fix this.  I will also get a live deployment happening, and hopefully I can update this project submission information when done.
