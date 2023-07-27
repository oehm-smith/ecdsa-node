const UserWallets = require("./UserWallets");

describe('UserWallets', () => {
    const uw = new UserWallets();
    const user = 'zzzz';
    const wallet='w1';

    beforeEach(() => {
        uw.clear();
    });

    describe('AddUser', () => {
        it('duplicates', () => {
            expect(uw.getUsers()).toHaveLength(0);
            expect(uw.addUser(user)).toEqual(true);
            expect(uw.addUser(user)).toEqual(false);
            expect(uw.getUsers()).toHaveLength(1);
        })
    });

    describe('getUser', () => {
       it('empty wallets', () => {
           uw.addUser(user);
           expect(uw.getUser(user)).toEqual({});
       })

        it('one wallet', () => {
            uw.addUser(user);
            uw.updateUserWallet(user, wallet, 99);
            expect(uw.getUser(user)).toEqual({w1: {balance: 99}});
        })
        it('two wallets', () => {
            uw.addUser(user);
            uw.updateUserWallet(user, wallet, 99);
            uw.updateUserWallet(user, wallet+'2', 999);
            expect(uw.getUser(user)).toEqual({w1: {balance: 99}, w12: {balance: 999}});
        })
    });

    describe('Wallets', () => {
        it('updateUserWallet', () => {
            expect(uw.addUser(user)).toEqual(true);
            expect(Object.keys(uw.getUserWallets(user))).toHaveLength(0);
            uw.updateUserWallet(user, wallet, 99);
            const userWallets = uw.getUserWallets(user)
            expect(Object.keys(userWallets)).toHaveLength(1);
            expect(userWallets[wallet].balance).toEqual(99)
        })
    })
})
