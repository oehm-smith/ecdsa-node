const Cryptography = require('./Cryptography')

class UserWallets {
    userWallets = {}; // Users to multiple wallets

    constructor() {
        this.setupDummyData();
    }

    setupDummyData() {
        ['tom', 'dan'].forEach(user => {
            const publicKey = Cryptography.createNewPublicPrivateKey();

            this.createUpdateUserWallet(user, publicKey, Math.round(Math.random() * 1000))
        })
    }

    clear() {
        this.userWallets = {};
    }

    getUsers() {
        return Object.keys(this.userWallets);
    }

    getUserWallets(user) {
        if (!user) {
            throw Error("Must have user arg");
        };
        return this.userWallets[user];
    }

    /**
     * @param user
     * @param publicKey
     * @param balance
     * @return boolean - if user existed
     */
    createUpdateUserWallet(user, publicKey, balance = 0) {
        let userAlreadyExisted = false;
        if (!(user && publicKey) ) {
            throw Error("Must have user and wallet args");
        }

        if (!this.userWallets.hasOwnProperty(user)) {
            this.addUser(user);
        } else {
            userAlreadyExisted = true;
        }
        this.userWallets[user][publicKey] = {balance: balance};
        return userAlreadyExisted;
    }

    /**
     * @param user
     * @returns {boolean} - if user added (didn't already exist)
     */
    addUser(user) {
        if (!this.userWallets.hasOwnProperty(user)) {
            // this.users.push(user);
            this.userWallets[user] = {};
            return true;
        }
        return false;
    }


    getUser(user) {
        if (!this.userWallets.hasOwnProperty(user)) {
            return null;
        }
        return this.userWallets[user];
    }

    /**
     *
     * @param user
     * @param wallet
     * @return wallet w public key and balance or null if no user or user hasn't wallet
     */
    getUserWallet(user, wallet) {
        if (!this.userWallets.hasOwnProperty(user)) {
            return null;
        }
        if (!this.userWallets[user].hasOwnProperty(wallet)) {
            return null;
        }
        return this.userWallets[user][wallet];
    }
}

module.exports = UserWallets;
