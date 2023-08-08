const Cryptography = require('./Cryptography')
const Logger = require('./Logger')

// TODO - I'm only using one of these classes!

/**
 * Class for Users and their Wallets.  Exploded out in to 3 classes to make expanding the wallet fields easier.
 */
class Wallets {
    balance = 0

    constructor(balance = 0) {
        this.balance = balance;
    }
}

class UserWallets {
    wallets = new Map<Wallets>(null);    // Map of wallet addresses to Wallets

    add(address, balance=0) {
        this.wallets.set(address, new Wallet(balance))
    }

    remove(address) {
        this.wallets.delete(address);
    }

    getAddresses() {
        return Array.from(this.wallets.keys());
    }

    getWallets(address) {
        return Array.from(this.wallets.get(address));
    }
}

class Users {
    users = new Map(); // Map of Users to UserWallets

    constructor() {
        this.logger = Logger();
    }

    clear() {
        this.logger.debug(`clear users - currently contains: ${this.users.size}`)

        this.users.clear();
        this.logger.debug(`clear users - now contains: ${this.users.size}`)
    }

    /**
     *
     * @return Array of usernames
     */
    getUsers() {
        return Array.from(this.users.keys());
    }

    /**
     * @param user
     * @return Map of user wallets
     */
    getUserWallets(user) {
        if (!user) {
            throw Error("Must have user arg");
        }
        return this.users.get(user);
    }

    /**
     * @param user
     * @param publicKey
     * @param balance
     * @exception Error if existing user attempted to be added
     **/
    createUpdateUserWallet(user, publicKey, balance = 0) {
        let userAlreadyExisted = false;
        if (!(user && publicKey) ) {
            throw Error("Must have user and wallet args");
        }

        if (!this.users.has(user)) {
            this.addUser(user);
        } else {
            userAlreadyExisted = true;
        }
        const allWallets = this.getAllWallets();
        const userWallets = this.users.get(user)
        if (allWallets.has(publicKey)) {
            throw new Error(`Wallet addresses must be unique - ${publicKey} already used.`)
        }
        userWallets.set(publicKey, {balance})
        this.logger.info(`CreateUpdateUserWallet: ${user} with publicKey: ${publicKey}, balance: ${balance}`)

        return userAlreadyExisted;
    }

    /**
     * @param user
     * @exception Error if existing user attempted to be added
     */
    addUser(user) {
        if (this.users.has(user)) {
            throw new Error(`Attempting to add existing user: ${user}`)
        }
        this.logger.info(`Add user: ${user}`)
        this.users.set(user, new Map());
    }


    getUser(user) {
        if (!this.users.has(user)) {
            return null;
        }
        return this.users.get(user);
    }

    /**
     *
     * @param user
     * @param wallet
     * @return wallet w public key and balance or null if no user or user hasn't wallet
     */
    getUserWallet(user, wallet) {
        const userWallets = this.users.get(user);
        if (!userWallets) {
            return null;
        }
        return userWallets.get(wallet);
    }

    /**
     * @return Map of wallets - its a copy, however the wallets in it are the original ones
     */
    getAllWallets() {
        let allWallets =  {};
        this.users.forEach((userValue, userKey) => {
            allWallets = {...allWallets, ...Object.fromEntries(userValue)};
            // userValue.forEach((userWalletValue, userWalletKey) => {
            //     allWallets.push(Object.fromEntries(userWalletValue));
            // });
        });
        return new Map(Object.entries(allWallets));
    }

    /**
     *
     * @return Array of wallet addresses
     */
    getAllWalletAddressess() {
        const allWalletAddresses =  [];
        this.users.forEach((userValue, userKey) => {
            allWalletAddresses.push(...Array.from(userValue.keys()));
        });
        return allWalletAddresses;
    }

    /**
     *
     * @param publicKey
     * @return wallet - {balance: X}
     * @exception Error if wallet doesnt exist
     */
    getWallet(publicKey) {
        const allWallets = this.getAllWallets();
        if (! allWallets.has(publicKey)) {
            throw new Error(`No wallet with given publickey exists: ${publicKey}`)
        }
        return allWallets.get(publicKey);
    }

    /**
     *
     * @param action - from (public key), to (public key), operation (it will be 'transfer') and amount
     * @param signature - signed using private key associated with from
     */
    transfer(action, signature) {
        const {  from, to, amount } = action;
        // verify the signature is from the action
        const isValid = Cryptography.verify(signature, action, from);
        if (isValid) {
            this.logger.info(`message is valid: ${isValid}`)
            // execute the action
            const amountNbr = parseInt(amount, 10);
            const fromWallet = this.getWallet(from);
            const toWallet = this.getWallet(to);
            fromWallet.balance -= amountNbr;
            toWallet.balance += amountNbr;

            return isValid;
        } else {
            throw new Error("Cannot transfer between wallets - actions are not valid wrt Signature")
        }
    }
}

module.exports = {Users, UserWallets, Wallets};
