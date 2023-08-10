import server from "./server";
import React, { useEffect, useState } from "react"
import Modal from 'react-modal';
import Select from "react-select"
import WalletConnectSecureBrowserPlugin from './WalletConnectSecureBrowserPlugin.js'
import { prepareAddress } from "./Utils.js"
import { createWallet } from "./wallets.js"
import log from 'loglevel';

const customStyles = {
  content: {
    top: '25%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -25%)',
  },
  width: '100%'
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
    // New user chosen, so their Wallet Connection must be logged in to after selecting a wallet
    setHasWalletConnectModalBeenOpenForUser(false);
  }, [loggedInUser]);

  function runChange() {
    console.log(`Wallet - user changed to ${loggedInUser}`);
    loadUserWallets();
    setLoginModalDisabled(false);
  }
  async function loadUserWallets(){
    if (loggedInUser) {
      await getWallets(loggedInUser);
    }
  }

  async function getWallets(user) {
    try {
      const {
        data: { message, wallets },
      } = await server.get(`users/` + user);
      log.info(`getWallets for: ${user}, message: "${message}", wallets: ${JSON.stringify(wallets)}`);
      setWallets(wallets);
    } catch (ex) {
      log.error(`ex response: ${JSON.stringify(ex)}`)
      if (ex.response.status === 400) {
        setMessage(`User doesnt exist: ${newUser} or hasn't wallets - create one`);
      } else {
        setMessage(ex.message);
      }
    }
  }

  async function getWallet(user, givenWallet) {
    try {
      const {
        data: { message, wallet },
      } = await server.get(`users/` + user + '/wallets/' + givenWallet);
      log.info(`getWallet for ${user} - message: "${message}", wallet: ${prepareAddress(givenWallet)}`);
      setBalance(wallet.balance)
    } catch (ex) {
      log.error(`wallet error response: ${ex}`)
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
    if (! hasWalletConnectModalBeenOpenForUser) {
      setWalletConnectModalIsOpen(true);
      setHasWalletConnectModalBeenOpenForUser(true);
    }
    setSelectedWallet(theSelectedWallet.value)
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

  return (
    <div className="container wallet" style={loginModalDisabled ? {pointerEvents: "none", opacity: "0.4"} : {}}>
      <h1>Wallets</h1>

      <div>
        <Select defaultValue={selectedWallet}
          options={walletsOptions}
          onChange={walletSelected}
        />
      </div>

      <div className="balance">{balance}</div>
      <button onClick={newWallet}>New Wallet</button>

      <Modal
          isOpen={walletConnectModalIsOpen}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Unlock wallet"
      >
        <h2>Login to Wallet Connection</h2>
        <form>
          <label>Password</label><input placeholder="Anything or nothing (dev build)"  className="WalletModalInput"/>
          <button onClick={closeModal}>submit</button>
        </form>
      </Modal>
    </div>
  );
}

export default Wallet;
