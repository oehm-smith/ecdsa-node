import { useEffect, useState } from "react";
import log from 'loglevel';
import server from "./server";
import XMessage from "./XMessage.jsx"
import WalletConnectSecureBrowserPlugin from "./WalletConnectSecureBrowserPlugin.js"
import { createWallet } from "./wallets.js"

function User({ loggedInUser, setLoggedInUser }) {
    const [newUser, setNewUser] = useState("");
    const [message, setMessage] = useState("");
    const [users, setUsers] = useState([]);
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

        log.debug(`doLogin: ${newUser}`)
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
        log.debug(`addNewUser: ${theNewUser}`)
        try {
            const {
                data: { message },
            } = await server.post(`users`, {
                user: theNewUser,
            });
            // setLoggedInUser(theNewUser);
            log.debug(`addNewUser: ${theNewUser} - response: ${message}`);
        } catch (ex) {
            log.error(ex.message);//.data.message);
            setMessage(ex.message);
        }
    }

    async function createNewUser(evt) {
        log.debug(`createNewUser: ${newUser}`)
        addNewUser(newUser);
    }

    async function setupDummyUsers(evt) {
        console.log(`setupDummyUsers - evt: ${evt}`)
        evt.preventDefault();
        const dummyUsers = ['tom', 'dan'];
        if (users.filter(u => dummyUsers.indexOf(u) > -1).length == dummyUsers.length) {
            log.error(`setupDummyUsers - already have dummy users`);
            setMessage(`setupDummyUsers - already have dummy users`);
        } else {
            log.debug(`Add dummy users before for: ${JSON.stringify(dummyUsers)}`)
            for (const dummyUser of dummyUsers) {
                log.debug(`Add dummy user before test: ${dummyUser}`)
                if (users.indexOf(dummyUser) == -1) {
                    log.debug(`Add dummy user after test: ${dummyUser}`)
                    const doIt = async () => {
                        const publicKey = WalletConnectSecureBrowserPlugin.createNewPublicPrivateKey();

                        log.debug(`Add dummy user: ${dummyUser}`)
                        await addNewUser(dummyUser)
                        await createWallet(dummyUser, publicKey, Math.round(Math.random() * 1000))
                    };
                    await doIt();
                } else {
                    log.info(`User already added: ${dummyUser}`)
                }
            }
            await getUsers();
        }
    }

    const headerMessageStyle = {
        fontSize: "0.5em",
    }
    return (
        <form className="container login">
            <h1>User <span style={ headerMessageStyle }>(Browser - not part of this app as such)</span></h1>
            <button className="button" onClick={setupDummyUsers}>Create dummy users</button>

            <p>Current user: {loggedInUser}</p>
            <label>
                <input
                    placeholder="User"
                    value={newUser}
                    onChange={setValue(setNewUser)}
                ></input>
            </label>
            <p>Users: {users.join(', ')}</p>

            <button className="button" onClick={() => createNewUser(newUser)}>
                Create New User
            </button>
            {/*<input type="submit" className="button" value="login" />*/}
            <button className="button" onClick={login}>Login</button>
            <XMessage message={message}/>
        </form>
    );
}

export default User;
