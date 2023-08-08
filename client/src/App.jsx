import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";
import 'react-toastify/dist/ReactToastify.css';
import { useState } from "react";
import User from "./User.jsx"
import { ToastContainer } from 'react-toastify';

function App() {
    const [balance, setBalance] = useState(0);
    const [publicKey, setPublicKey] = useState("");
    const [loggedInUser, setLoggedInUser] = useState("");
    const [transferDialogDisabled, setTransferDialogDisabled] = useState(true);
    const [isNewWallet, setIsNewWallet] = useState(false);

    return (
        <div className="app">
            <User
                loggedInUser={loggedInUser}
                setLoggedInUser={setLoggedInUser}
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
            <ToastContainer/>
        </div>
    );
}

export default App;
