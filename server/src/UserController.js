module.exports=function(app) {

    const UserWallets = require("./UserWallets")

    const userWallets = new UserWallets();

    app.post("/users", (req, res) => {
        const { user } = req.body;
        console.log(`add user: ${user}`);

        let message = `add user ${user}`;
        if (userWallets.addUser(user)) {
        } else {
            message = `user already exists: ${user}`;
        }
        console.log(`all users: ${userWallets.getUsers()}`);

        res.send({ message })
    })

    app.get("/users", (req, res) => {
        const users = userWallets.getUsers();
        res.send({ users })
    });

    app.get("/users/:user", (req, res) => {
        const { user } = req.params;
        const wallets = userWallets.getUser(user);

        if (!wallets) {
            message = `user doesn't exist (no wallets): ${user}`;
            // res.status(401).json({message})
            res.status(400).send({ data: message })
        } else {
            res.send({ message: "all good", wallets })
        }
    });

    app.get("/users/:user/wallets/:wallet", (req, res) => {
        console.log("/users/:user/wallets/:wallet")
        const { user } = req.params;
        const { wallet } = req.params;
        const userWallet = userWallets.getUserWallet(user, wallet);

        if (!userWallet) {
            message = `user or wallet doesn't exist (no wallets): ${user}, ${wallet}`;
            // res.status(401).json({message})
            res.status(400).send({ data: message })
        } else {
            res.send({ message: "all good", wallet: userWallet })
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
            res.status(401).send({ data: message })
        } else {
            message += userData;
            res.send({ message })
        }
        console.log(`all users: ${userWallets.getUsers()}`);
    })
}
