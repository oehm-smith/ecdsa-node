const UserWallets = require("./UserWallets");

describe('UserWallets', () => {
    const uw = new UserWallets();
    const user = 'zzzz';
    const wallet='0xABC';

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
            uw.createUpdateUserWallet(user, wallet, 99);
            expect(uw.getUser(user)).toEqual({w1: {balance: 99}});
        })
        it('two wallets', () => {
            uw.addUser(user);
            uw.createUpdateUserWallet(user, wallet, 99);
            uw.createUpdateUserWallet(user, wallet+'2', 999);
            expect(uw.getUser(user)).toEqual({w1: {balance: 99}, w12: {balance: 999}});
        })
    });

    describe('Wallets', () => {
        it('updateUserWallet as update', () => {
            expect(uw.addUser(user)).toEqual(true);
            expect(Object.keys(uw.getUserWallets(user))).toHaveLength(0);
            uw.createUpdateUserWallet(user, wallet, 99);
            const userWallets = uw.getUserWallets(user)
            expect(Object.keys(userWallets)).toHaveLength(1);
            expect(userWallets[wallet].balance).toEqual(99)
        });

        it('updateUserWallet as new user should succeed', () => {
            const newUser = 'aaa';
            const newWallet = '0x123'

            // Don't do this in this test
            // expect(uw.addUser(newUser)).toEqual(true);
            // expect(Object.keys(uw.getUserWallets(newUser))).toHaveLength(0);
            uw.createUpdateUserWallet(newUser, newWallet, 666);
            const userWallets = uw.getUserWallets(newUser)
            expect(Object.keys(userWallets)).toHaveLength(1);
            expect(userWallets[newWallet].balance).toEqual(666)
        });
    })
})
