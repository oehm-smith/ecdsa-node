import server from "./server";
import React, { useEffect, useState } from "react"
import XMessage from "./XMessage.jsx"
import Modal from 'react-modal';
import Select from "react-select"
import WalletConnectSecureBrowserPlugin from './WalletConnectSecureBrowserPlugin.js'
import { prepareAddress } from "./Utils.js"
import { createWallet } from "./wallets.js"
import log from "loglevel"

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#root');

function Wallet({ publicKey, setPublicKey, balance, setBalance, loggedInUser, setTransferDialogDisabled, isNewWallet, setIsNewWallet, message, setMessage }) {
  const [wallets, setWallets] = useState({});
  const [loginModalDisabled, setLoginModalDisabled] = useState(true);
  const [selectedWallet, setSelectedWallet] = useState('');
  const [walletConnectModalIsOpen, setWalletConnectModalIsOpen] = useState(false);
  const [hasWalletConnectModalBeenOpenForUser, setHasWalletConnectModalBeenOpenForUser] = useState(false);

  useEffect(() => {
    setMessage('');
  }, []);

  useEffect(() => {
    if (isNewWallet) {
      runChange();
      setIsNewWallet(false);
      getWallet(loggedInUser, selectedWallet);
    }
  }, [isNewWallet]);

  useEffect(() => {
      runChange();
  }, [loggedInUser]);

  function runChange() {
    console.log(`Wallet - user changed to ${loggedInUser}`);
    loadUserWallets();
    // New user chosen, so their Wallet Connection must be logged in to after selecting a wallet
    setHasWalletConnectModalBeenOpenForUser(false);
    // setSelectedWallet(" ");
    // setBalance(0);
    setLoginModalDisabled(false);
  }
  async function loadUserWallets(){
    if (loggedInUser) {
      const userWallets = await getWallets(loggedInUser);
      console.log(`userWallets: ${JSON.stringify(userWallets)}`)
    }
  }

  async function getWallets(user) {
    try {
      const {
        data: { message, wallets },
      } = await server.get(`users/` + user);
      console.log(`getWallets user response - message: ${message}, wallets: ${JSON.stringify(wallets)}`);
      setWallets(wallets);
    } catch (ex) {
      console.log(`ex response: ${JSON.stringify(ex)}`)
      if (ex.response.status === 400) {
        setMessage(`User doesnt exist: ${newUser} or hasn't wallets - create one`);
      } else {
        setMessage(ex.message);
      }
    }
  }

  async function getWallet(user, givenWallet) {
    console.log(`getWallet user: ${user}, wallet: ${givenWallet}`);
    try {
      const {
        data: { message, wallet },
      } = await server.get(`users/` + user + '/wallets/' + givenWallet);
      console.log(`getWallet user response - message: ${message}, wallet: ${JSON.stringify(wallet)}`);
      setBalance(wallet.balance)
    } catch (ex) {
      console.log(`ex response: ${ex}`)
      if (ex?.response.status === 400) {
        setMessage(`User doesnt exist: ${newUser} or hasn't wallets - create one`);
      } else {
        setMessage(ex.message);
      }
    }
  }

  async function onChange(evt) {
    const address = evt.target.value;
    setPublicKey(address);
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  function openWalletConnectModal() {
    setWalletConnectModalIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    // subtitle.style.color = '#f00';
  }

  function closeModal() {
    setWalletConnectModalIsOpen(false);
    setLoginModalDisabled(false);
  }

  const walletsOptions = Object.keys(wallets).map(w => ({value: w, label: prepareAddress(w)}));
  // walletsOptions.push({value: " ", label: " "});

  function walletSelected(theSelectedWallet) {
    console.log(`walletSeleted: ${JSON.stringify(theSelectedWallet)}`)
    if (! hasWalletConnectModalBeenOpenForUser) {
      setWalletConnectModalIsOpen(true);
      setHasWalletConnectModalBeenOpenForUser(true);
    }
    setSelectedWallet(theSelectedWallet.value)
    // DUPE ???????
    setPublicKey(theSelectedWallet.value);
    getWallet(loggedInUser, theSelectedWallet.value);
    setTransferDialogDisabled(false);
  }

  function clearWallets() {
    setSelectedWallet(" "); // I can't work out how to set selectedWallet to "" / null when new user chosen
  }

  async function newWallet() {
    const publicKey = WalletConnectSecureBrowserPlugin.createNewPublicPrivateKey();

    createWallet(loggedInUser, publicKey);
    setIsNewWallet(true);
  }

  console.log(`selectedWallet: ${selectedWallet}`)
  return (
    <div className="container wallet" style={loginModalDisabled ? {pointerEvents: "none", opacity: "0.4"} : {}}>
      <h1>Wallets</h1>

      <div>
        <Select defaultValue={selectedWallet}
          options={walletsOptions}
          onChange={walletSelected}
        />
      </div>

      <div className="balance">Balance: {balance}</div>
      <button onClick={newWallet}>New Wallet</button>

      <Modal
          isOpen={walletConnectModalIsOpen}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Unlock wallet"
      >
        <h2>Login to Wallet Connection</h2>
        <button onClick={closeModal}>submit</button>
        <div> password</div>
        <form>
          <input />
        </form>
      </Modal>
    </div>
  );
}

export default Wallet;
