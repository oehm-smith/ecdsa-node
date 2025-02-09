import { useEffect, useState } from "react";
import log from 'loglevel';
import server from "./server";
import XMessage from "./XMessage.jsx"
import WalletConnectSecureBrowserPlugin from "./WalletConnectSecureBrowserPlugin.js"
import { createWallet } from "./wallets.js"
import { StatusCodes } from "http-status-codes";

function User({ loggedInUser, setLoggedInUser, users, setUsers, message, setMessage }) {
    const [newUser, setNewUser] = useState("");

    const setValue = (setter) => (evt) => setter(evt.target.value);

    log.enableAll();

    useEffect(() => {
        const doIt = async () => {
            await getUsers();
        }
        doIt();
    }, [])

    async function login(evt) {
        evt.preventDefault();

        log.debug(`choose: ${newUser}`)
        try {
            const {
                data: { message },
            } = await server.post(`/users/login`, {
                user: newUser,
            });
            setLoggedInUser(newUser);
            log.debug(`doLogin response: ${message}`);
        } catch (ex) {
            console.log(`ex response: ${JSON.stringify(ex)}`)
            if (ex.response.status === 401) {
                setMessage(`User doesnt exist: ${newUser}`);
            } else {
                setMessage(ex.message);
            }
        }
    }

    async function getUsers() {
        try {
            const {
                data: { users },
            } = await server.get(`/users`);
            setUsers(users);
            log.debug(`getUsers: ${JSON.stringify(users)}`);
        } catch (ex) {
            log.debug(`getUsers error - ex response: ${JSON.stringify(ex)}`)
            if (ex.response.status === 401) {
                setMessage(`User doesnt exist: ${newUser}`);
            } else {
                setMessage(ex.message);
            }
        }
    }

    async function addNewUser(theNewUser){
        try {
            const {
                data: { message },
            } = await server.post(`users`, {
                user: theNewUser,
            });
            // setLoggedInUser(theNewUser);
            log.info(`addNewUser: ${theNewUser} - response: ${message}`);
        } catch (ex) {
            let message;
            if (ex?.response?.data?.message) {
                message = ex.response.data.message;
            } else {
                message = ex.message;
            }
            log.error(message);
            setMessage(message);
        }
    }

    async function createNewUser(evt) {
        evt.preventDefault();
        addNewUser(newUser);
        await getUsers();
        setLoggedInUser(newUser);
    }

    async function clearUsers() {
        const response = await server.delete("users")
        await getUsers();
    }

    async function setupDummyUsers(evt) {
        console.log(`setupDummyUsers - evt: ${evt}`)
        evt.preventDefault();
        const dummyUsers = ['tom', 'dan'];
        await clearUsers();
        // log.debug(`Add dummy users before for: ${JSON.stringify(dummyUsers)}`)
        for (const dummyUser of dummyUsers) {
            const doIt = async () => {
                const publicKey = WalletConnectSecureBrowserPlugin.createNewPublicPrivateKey();

                log.debug(`Add dummy user: ${dummyUser} - ${publicKey}`)
                await addNewUser(dummyUser)
                await createWallet(dummyUser, publicKey, Math.round(Math.random() * 1000))
            };
            await doIt();
        }
        await getUsers();
    }

    return (
        <form className="container user">
            <button className="button" onClick={setupDummyUsers}>Dummy</button>

            <label>
                <input
                    placeholder="user"
                    value={newUser}
                    onChange={setValue(setNewUser)}
                ></input>
            </label>
            <button className="button" disabled={newUser.length === 0} onClick={login}>Choose</button>

            <button className="button" disabled={newUser.length === 0} onClick={createNewUser}>
                Create
            </button>
        </form>
    );
}

export default User;
