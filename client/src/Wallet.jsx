import server from "./server";
import React, { useEffect, useState } from "react"
import XMessage from "./XMessage.jsx"
import Modal from 'react-modal';
import Select from "react-select"

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

function Wallet({ address, setAddress, balance, setBalance, loggedInUser }) {
  const [message, setMessage] = useState("");
  const [wallets, setWallets] = useState([]);
  const [loginModalDisabled, setLoginModalDisabled] = useState(true);
  const [selectedWallet, setSelectedWallet] = useState('');
  const [walletConnectModalIsOpen, setWalletConnectModalIsOpen] = useState(false);


  useEffect(() => {
    setMessage('');
  }, []);

  useEffect(() => {
    const doIt = async () => {
      if (loggedInUser) {
        console.log(`Wallet - user changed to ${loggedInUser}`);
        const userWallets = await getWallets(loggedInUser);
        // New user chosen, so their Wallet Connection must be logged in to
        setSelectedWallet(null);
        setBalance(0);
        setLoginModalDisabled(false);
        openWalletConnectModal();
      }
    }
    doIt();
  }, [loggedInUser]); // Only re-run the effect if count changes

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
    setAddress(address);
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

  const walletsOptions = Object.keys(wallets).map(w => ({value: w, label: w}));

  function walletSelected(theSelectedWallet) {
    console.log(`walletSeleted: ${JSON.stringify(theSelectedWallet)}`)
    setSelectedWallet(theSelectedWallet.value)
    getWallet(loggedInUser, theSelectedWallet.value);
  }

  console.log(`selectedWallet: ${selectedWallet}`)
  return (
    <div className="container wallet" style={loginModalDisabled ? {pointerEvents: "none", opacity: "0.4"} : {}}>
      <h1>Your Wallet</h1>

      <div>
        <Select defaultValue={selectedWallet}
          options={walletsOptions}
          onChange={walletSelected}
          placeholder="Select wallet..."
        />
      </div>

      <div className="balance">Balance: {balance}</div>
      <XMessage message={message}/>

      <Modal
          isOpen={walletConnectModalIsOpen}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal"
      >
        <h2>Login to Wallet Connection</h2>
        {/*ref={(_subtitle) => (subtitle = _subtitle)}*/}
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
