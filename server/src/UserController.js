module.exports=function(app) {

    const UserWallets = require("./UserWallets")

    const userWallets = new UserWallets();

    // Add new user
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

    // Get users
    app.get("/users", (req, res) => {
        const users = userWallets.getUsers();
        res.send({ users })
    });

    // Login given user
    app.post("/users/login", (req, res) => {
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

    // Get specific user
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

    // Get user's specific wallet
    app.get("/users/:user/wallets/:publicKey", (req, res) => {
        const { user } = req.params;
        const { publicKey } = req.params;
        const userWallet = userWallets.getUserWallet(user, publicKey);

        if (!userWallet) {
            message = `user or wallet doesn't exist (no wallets): ${user}, ${publicKey}`;
            // res.status(401).json({message})
            res.status(400).send({ data: message })
        } else {
            res.send({ message: "all good", wallet: userWallet })
        }
    });

    // Create user wallet
    app.post("/users/:user/wallets/:publicKey", (req, res) => {
        const { user } = req.params;
        const { publicKey } = req.params;
        const { balance } = req.body || 0;

        let message;

        try {
            const userAlreadyExisted = userWallets.createUpdateUserWallet(user, publicKey, balance)

            message = `User existed - added new public key: ${user}, ${publicKey}`;
            if (!userAlreadyExisted) {
                message = `User didnt exist - created them and added new public key: ${user}, ${publicKey}`;
            }
            res.send({ message })
        } catch (ex) {
            res.status(500).send({message : ex})
        }
    });
}
