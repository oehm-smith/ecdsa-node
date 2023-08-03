const express = require("express");
const cors = require("cors");
const morgan = require('morgan')
const UserController = require("./src/UserController")

const port = 3042;

const app = express();

function printRoutes() {
  console.log(`Routes:`)
  app._router.stack.forEach(function (r) {
    if (r.route && r.route.path) {
      console.log(`    ` + Object.keys(r.route.methods)[0].toUpperCase() + " " + r.route.path)
    }
  })
}

function main() {
  app.use(cors());
  app.use(express.json());
  app.use(morgan('combined'))

  UserController(app);

  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });

  printRoutes();
}

main();
