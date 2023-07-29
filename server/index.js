const express = require("express");
const cors = require("cors");
var morgan = require('morgan')

const UserController = require("./src/UserController")

const port = 3042;

const app = express();

// const balances = {
//   "0x1": 100,
//   "0x2": 50,
//   "0x3": 75,
// };
//
// app.get("/balance/:address", (req, res) => {
//   const { address } = req.params;
//   const balance = balances[address] || 0;
//   res.send({ balance });
// });
//
// app.post("/send", (req, res) => {
//   const { sender, recipient, amount } = req.body;
//
//   setInitialBalance(sender);
//   setInitialBalance(recipient);
//
//   if (balances[sender] < amount) {
//     res.status(400).send({ message: "Not enough funds!" });
//   } else {
//     balances[sender] -= amount;
//     balances[recipient] += amount;
//     res.send({ balance: balances[sender] });
//   }
// });


// -----------------------------------------------------------------

function main() {
  app.use(cors());
  app.use(express.json());
  app.use(morgan('combined'))

  UserController(app);

  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });

  (() => {
    console.log(`Routes:`)
    app._router.stack.forEach(function (r) {
      if (r.route && r.route.path) {
        console.log(`    ` + Object.keys(r.route.methods)[0].toUpperCase() + " " + r.route.path)
      }
    })
  })();
}

main();
function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
