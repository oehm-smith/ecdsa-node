import { useEffect, useState } from "react";
import log from 'loglevel';
import server from "./server";
import XMessage from "./XMessage.jsx"
import WalletConnectSecureBrowserPlugin from "./WalletConnectSecureBrowserPlugin.js"
import { createWallet } from "./wallets.js"

function User({ loggedInUser, setLoggedInUser, users, setUsers }) {
    const [newUser, setNewUser] = useState("");
    const [message, setMessage] = useState("");

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

                log.debug(`Add dummy user: ${dummyUser}`)
                await addNewUser(dummyUser)
                await createWallet(dummyUser, publicKey, Math.round(Math.random() * 1000))
            };
            await doIt();
        }
        await getUsers();
    }

    const headerMessageStyle = {
        fontSize: "0.5em",
    }
    return (
        <form className="container user">
            {/*<h1>User</h1>*/}
                {/*<span style={ headerMessageStyle }><br/>(Browser)</span></h1>*/}
            <button className="button" onClick={setupDummyUsers}>Dummy</button>

            {/*<p>{loggedInUser}</p>*/}
            <label>
                <input
                    placeholder="user"
                    value={newUser}
                    onChange={setValue(setNewUser)}
                ></input>
            </label>
            <button className="button" disabled={newUser.length === 0} onClick={login}>Choose</button>

            <button className="button" disabled={newUser.length === 0} onClick={() => createNewUser(newUser)}>
                Create
            </button>
            {/*<input type="submit" className="button" value="login" />*/}
            <XMessage message={message}/>
        </form>
    );
}

export default User;
