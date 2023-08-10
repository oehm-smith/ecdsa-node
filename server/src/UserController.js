const Logger = require("./Logger")
const { StatusCodes } = require("http-status-codes")
const { unserialize, prepareAddress } = require("./Utils")
const { hexToBytes, bytesToUtf8 } = require("ethereum-cryptography/utils")
const JSONbig = require('json-bigint')({ useNativeBigInt: true });

module.exports=function(app) {
    const Logger = require('./Logger')
    const StatusCodes = require('http-status-codes').StatusCodes;

    const logger = Logger();

    const Users = require("./UserWallets").Users;

    const userWallets = new Users();

    // Add new user
    app.post("/users", (req, res) => {
        const { user } = req.body;
        // console.log(`add user: ${user}`);

        let message = `User ${user} - created`;
        userWallets.addUser(user)

        res.status(StatusCodes.CREATED).send({message});
    })

    // Get users
    app.get("/users/?$", (req, res) => {
        const users = userWallets.getUsers();
        logger.debug(`All users: ${JSON.stringify(users)}`)
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
            res.status(StatusCodes.UNAUTHORIZED).send({ data: message })
        } else {
            message += userData;
            res.send({ message })
        }
        console.log(`all users: ${userWallets.getUsers()}`);
    })

    app.get("/users/wallets", (req, res) => {
        const allWallets = userWallets.getAllWalletAddressess();
        console.log(`allWallets: ${JSON.stringify(allWallets)}`);
        if (!allWallets) {
            message = `user or wallet doesn't exist (no wallets): ${user}, ${publicKey}`;
            res.status(StatusCodes.NOT_FOUND).send({ data: message, wallets: null })
        } else {
            res.send({ message: "all good", wallets: allWallets })
        }
    });

    // Get specific user
    app.get("/users/:user", (req, res) => {
        const { user } = req.params;
        const walletsMap = userWallets.getUser(user);

        if (!walletsMap) {
            message = `user doesn't exist (no wallets): ${user}`;
            res.status(StatusCodes.NOT_FOUND).send({ data: message })
        } else {
            const wallets = Object.fromEntries(walletsMap);
            res.send({ message: "all good", wallets })
        }
    });

    // Get user's specific wallet
    app.get("/users/:user/wallets/:publicKey", (req, res) => {
        const { user } = req.params;
        const { publicKey } = req.params;
        const wallet = userWallets.getUserWallet(user, publicKey);

        if (!wallet) {
            message = `user or wallet doesn't exist (no wallets): ${user}, ${publicKey}`;
            res.status(400).send({ data: message })
        } else {
            res.send({ message: "all good", wallet })
        }
    });

    // Create user wallet
    app.post("/users/:user/wallets/:publicKey", (req, res) => {
        const { user } = req.params;
        const { publicKey } = req.params;
        const { balance } = req.body || 0;

        let message;

        try {
            const userAlreadyExisted = userWallets.createUpdateUserWallet(user, publicKey, balance);

            message = `User existed - added new public key for ${user} - ${prepareAddress(publicKey)}`;
            if (!userAlreadyExisted) {
                message = `User didnt exist - created them and added new public key: ${user}, ${prepareAddress(publicKey)}`;
            }
            res.send({ message })
        } catch (ex) {
            res.status(500).send({message : ex})
        }
    });

    app.post("/users/:user/wallets/:publicKey/transfer", (req, res) => {
        const { action, signature } = req.body;
        const { publicKey } = req.params;
        // const s = new SignatureType();
        if (publicKey != action.from) {
            throw new Error(`Transfer - public key in action is not same as in parameter`)
        }

        let message;

        try {
            let signatureObj = JSONbig.parse(signature); //bytesToUtf8(signature);
            userWallets.transfer(action, signatureObj);
            res.send({ action })
        } catch (ex) {
            console.error(ex);
            res.status(500).send({message : ex})
        }
    });

    app.delete("/users", (req, res) => {
        try {
            userWallets.clear();
            res.status(StatusCodes.OK).send();
        } catch (ex) {
            res.status(500).send({message : ex})
        }
    })
}
