import { useEffect, useState } from "react";
import log from 'loglevel';
import server from "./server";
import XMessage from "./XMessage.jsx"

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
            log.debug(`addNewUser response: ${message}`);
        } catch (ex) {
            log.error(ex.message);//.data.message);
            setMessage(ex.message);
        }
    }

    async function createNewUser(evt) {
        log.debug(`createNewUser: ${newUser}`)
        addNewUser(newUser);
    }
    return (
        <form className="container login">
            <h1>User</h1> (Browser - not part of this app as such)

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
