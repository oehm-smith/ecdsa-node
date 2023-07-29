const { all } = require("express/lib/application")
const UserWallets = require("./UserWallets").UserWallets;
const Users = require("./UserWallets").Users;
const Wallets = require("./UserWallets").Wallets;

describe('UserWallets', () => {
    const users = new Users();
    const user1 = 'user_1';
    const wallet11='0xABC';
    const wallet12='0xDEF';
    const user2 = 'user_2';
    const wallet21 = '0x123'
    const wallet22 = '0x456'

    beforeEach(() => {
        users.clear();
    });

    describe('AddUser', () => {
        it(`should not be able to add user twice 1`, () => {
            users.addUser(user1);
            expect(() => users.addUser(user1)).toThrowError();
        })
        it(`should not be able to add user twice 2`, () => {
            users.createUpdateUserWallet(user1, 'xxx');
            expect(() => users.addUser(user1)).toThrowError();
        })
    });

    describe('getUser', () => {
       it('empty wallets', () => {
           users.addUser(user1);
           expect(users.getUser(user1)).toEqual(new Map());
       })

        it('one wallet', () => {
            users.addUser(user1);
            users.createUpdateUserWallet(user1, wallet11, 99);
            const asObj = Object.fromEntries(users.getUser(user1))
            expect(asObj).toEqual({"0xABC": {balance: 99}});
        })
        it('two wallets', () => {
            users.addUser(user1);
            users.createUpdateUserWallet(user1, wallet11, 99);
            users.createUpdateUserWallet(user1, wallet11+'2', 999);
            const asObj = Object.fromEntries(users.getUser(user1))
            expect(asObj).toEqual({"0xABC": {balance: 99}, "0xABC2": {balance: 999}});
        })
    });

    describe('Wallets', () => {
        it('updateUserWallet as update', () => {
            expect(users.getUser(user1)).toEqual(null);
            users.createUpdateUserWallet(user1, wallet11, 99);
            const theUserWallets = users.getUserWallets(user1)
            expect(theUserWallets.size).toEqual(1);
            expect(theUserWallets.get(wallet11).balance).toEqual(99)
        });

        it('updateUserWallet as new user should succeed', () => {
            // Don't do this in this test
            // expect(uw.addUser(newUser)).toEqual(true);
            // expect(Object.keys(uw.getUserWallets(newUser))).toHaveLength(0);
            users.createUpdateUserWallet(user2, wallet21, 666);
            const theUserWallets = users.getUserWallets(user2)
            expect(theUserWallets.size).toEqual(1);
            expect(theUserWallets.get(wallet21).balance).toEqual(666)
        });

        it('multiple users, one wallet each', () => {
            users.createUpdateUserWallet(user1, wallet11, 555);
            users.createUpdateUserWallet(user2, wallet21, 666);
            expect(users.getUsers()).toHaveLength(2);
            expect(users.getUser(user1).get(wallet11).balance).toEqual(555)
            expect(users.getUser(user2).get(wallet21).balance).toEqual(666)
        })

        it('multiple users, multi wallets each, no duplicates', () => {
            users.createUpdateUserWallet(user1, wallet11, 550);
            users.createUpdateUserWallet(user1, wallet12, 555);
            users.createUpdateUserWallet(user2, wallet21, 660);
            users.createUpdateUserWallet(user2, wallet22, 666);
            expect(users.getUsers()).toHaveLength(2);
            expect(users.getAllWalletAddressess()).toHaveLength(4);
            expect(users.getUser(user1).get(wallet11).balance).toEqual(550)
            expect(users.getUser(user1).get(wallet12).balance).toEqual(555)
            expect(users.getUser(user2).get(wallet21).balance).toEqual(660)
            expect(users.getUser(user2).get(wallet22).balance).toEqual(666)
            const allWallets = users.getAllWallets();
            expect(allWallets.size).toEqual(4);
            expect(allWallets.get(wallet11).balance).toEqual(550);
            expect(allWallets.get(wallet12).balance).toEqual(555);
            expect(allWallets.get(wallet21).balance).toEqual(660);
            expect(allWallets.get(wallet22).balance).toEqual(666);
        });
        it('multiple users, multi wallets each, duplicates', () => {
            // Wallets must have unique address
            try {
                users.createUpdateUserWallet(user1, wallet11, 550);
                users.createUpdateUserWallet(user1, wallet12, 555);
                users.createUpdateUserWallet(user2, wallet11, 660);
                users.createUpdateUserWallet(user2, wallet22, 666);
                throw new Error("test should not reach here");
            } catch (e) {
                // Even though no wallets were added for user, they should still be included as a user
                expect(users.getUsers()).toHaveLength(2);
                expect(users.getAllWalletAddressess()).toHaveLength(2);
                expect(users.getUser(user1).get(wallet11).balance).toEqual(550)
                expect(users.getUser(user1).get(wallet12).balance).toEqual(555)
                expect(users.getUserWallets(user2).size).toEqual(0);
                const allWallets = users.getAllWallets();
                expect(allWallets.size).toEqual(2);
                expect(allWallets.get(wallet11).balance).toEqual(550);
                expect(allWallets.get(wallet12).balance).toEqual(555);
            }
        });
    });
})
