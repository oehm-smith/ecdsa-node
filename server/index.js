const express = require("express");
const app = express();
const cors = require("cors");
const UserWallets = require("./src/UserWallets")
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "0x1": 100,
  "0x2": 50,
  "0x3": 75,
};

const userWallets = new UserWallets();

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.post("/users", (req, res) => {
  const { user } = req.body;
  console.log(`add user: ${user}`);

  let message = `add user ${user}`;
  if (userWallets.addUser(user)) {
  } else {
    message = `user already exists: ${user}`;
  }
  console.log(`all users: ${userWallets.getUsers()}`);

  res.send({message})
})

app.get("/users", (req, res) => {
  const users = userWallets.getUsers();
  res.send({users})
});

app.get("/users/:user", (req, res) => {
  const { user } = req.params;
  const wallets = userWallets.getUser(user);

  if (! wallets) {
    message = `user doesn't exist (no wallets): ${user}`;
    // res.status(401).json({message})
    res.status(400).send({data: message})
  } else {
    res.send({message: "all good", wallets})
  }
});

app.get("/users/:user/wallets/:wallet", (req, res) => {
  console.log("/users/:user/wallets/:wallet")
  const { user } = req.params;
  const { wallet } = req.params;
  const userWallet = userWallets.getUserWallet(user, wallet);

  if (! userWallet) {
    message = `user or wallet doesn't exist (no wallets): ${user}, ${wallet}`;
    // res.status(401).json({message})
    res.status(400).send({data: message})
  } else {
    res.send({message: "all good", wallet: userWallet})
  }
});

app.post("/login", (req, res) => {
  const { user } = req.body;
  console.log(`login user: ${user}`);

  let message = `login user ${user}, userData: `;
  const userData = userWallets.getUser(user);
  if (userData === null) {
    message = `user doesn't exist: ${user}`;
    // res.status(401).json({message})
    res.status(401).send({data: message})
  } else {
    message += userData;
    res.send({message})
  }
  console.log(`all users: ${userWallets.getUsers()}`);
})
// -----------------------------------------------------------------

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
