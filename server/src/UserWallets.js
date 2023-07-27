class UserWallets {
    userWallets = {}; // Users to multiple wallets

    constructor() {
        this.setupDummyData();
    }

    setupDummyData() {
        ['tom', 'dan'].forEach(u => {
            this.addUser(u);
            ['0x1' + u, '0x2' + u].forEach(w => {
                this.updateUserWallet(u, w, Math.round(Math.random() * 100))
            })
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
     * @param wallet
     * @param amount
     * @return boolean - if user existed
     */
    updateUserWallet(user, wallet, amount = 0) {
        if (!(user && wallet) ) {
            throw Error("Must have user and wallet args");
        }

        if (!this.userWallets.hasOwnProperty(user)) {
            return false;
        }
        this.userWallets[user][wallet] = {balance: amount};
        return true;
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
