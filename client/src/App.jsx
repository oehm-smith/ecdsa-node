import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";
import 'react-toastify/dist/ReactToastify.css';
import { useState } from "react";
import User from "./User.jsx"
import { ToastContainer } from 'react-toastify';
import UsersList from "./UsersList.jsx"

function App() {
    const [balance, setBalance] = useState(0);
    const [publicKey, setPublicKey] = useState("");
    const [loggedInUser, setLoggedInUser] = useState("");
    const [transferDialogDisabled, setTransferDialogDisabled] = useState(true);
    const [isNewWallet, setIsNewWallet] = useState(false);
    const [users, setUsers] = useState([]);

    return (
        <div className="app">
            <div className="header">
                <User
                    loggedInUser={loggedInUser}
                    setLoggedInUser={setLoggedInUser}
                    users={users}
                    setUsers={setUsers}
                />
                <Wallet
                    balance={balance}
                    setBalance={setBalance}
                    publicKey={publicKey}
                    setPublicKey={setPublicKey}
                    loggedInUser={loggedInUser}
                    transferDialogDisabled={transferDialogDisabled}
                    setTransferDialogDisabled={setTransferDialogDisabled}
                    isNewWallet={isNewWallet}
                    setIsNewWallet={setIsNewWallet}
                />
            </div>
            <div className="userslist">
                <UsersList
                    users={users}
                    loggedInUser={loggedInUser}
                />
            </div>
            <div className="body">
                <Transfer
                    balance={balance}
                    setBalance={setBalance}
                    publicKey={publicKey}
                    loggedInUser={loggedInUser}
                    transferDialogDisabled={transferDialogDisabled}
                    setTransferDialogDisabled={setTransferDialogDisabled}
                    isNewWallet={isNewWallet}
                    setIsNewWallet={setIsNewWallet}
                />
            </div>
            <ToastContainer/>
        </div>
    );
}

export default App;
