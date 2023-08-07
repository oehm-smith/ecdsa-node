import React, { useEffect, useState } from "react";
import log from 'loglevel';
import server from "./server";
import Select from "react-select"
import XMessage from "./XMessage.jsx"
import { JSONStringify, prepareAddress } from "./Utils.js"
import WalletConnectSecureBrowserPlugin from "./WalletConnectSecureBrowserPlugin.js"
import { toHex, utf8ToBytes } from "ethereum-cryptography/utils"
import JSONbig from "json-bigint"

function Transfer({ address, balance, setBalance, loggedInUser, transferDialogDisabled, setTransferDialogDisabled }) {
  const [message, setMessage] = useState("");
  const [sendAmount, setSendAmount] = useState("");
  // const [recipient, setRecipient] = useState("");
  const [allWallets, setAllWallets] = useState([]);
  const [selectedWallet, setSelectedWallet] = useState('');
  const [walletPaneDisabled, setWalletPaneDisabled] = useState(true);

  useEffect( () => {
    async function doIt(){
      await getAllWallets();
    }
    doIt();
  }, [address])

  useEffect(() => {
    if (balance == 0) {
      setTransferDialogDisabled(true);
    }
  }, [balance])

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();
    const action = {operation: "transfer", from: address, to: selectedWallet, amount: sendAmount}
    const {  signature, message } = WalletConnectSecureBrowserPlugin.signMessage(action, address);  // todo change address to publicKey
    if (message) {
      setMessage(JSON.stringify(message));
    }
    log.info(JSON.stringify(message))
    log.debug(`transferSignature: ${JSONStringify(signature)}`)
    const signature2 = JSONbig.stringify(signature);
    try {
      const url = `users/${loggedInUser}/wallets/${address}/transfer`;
      const response = await server.post(url, {
        action,
        signature:signature2
      });
      console.log(`status: ${response.status}`)
    } catch (ex) {
      log.error(ex);
    }
  }

  async function getAllWallets() {
    try {
      const {
        data: { message, wallets },
      } = await server.get(`users/walletAddresses`);
      // console.log(`getAllWallets response - message: ${message}, wallets: ${JSON.stringify(wallets)}, address: ${address}`);
      setAllWallets(wallets.filter(w => w !== address));
    } catch (ex) {
      log.error(`getAllWallets error response: ${ex}`)
      return null;
      // if (ex.response.status === 400) {
      //   setMessage(`User doesnt exist: ${newUser} or hasn't wallets - create one`);
      // } else {
      //   setMessage(ex.message);
      // }
    }
  }

  const allWalletsOptions = allWallets.map(w => ({value: w, label: prepareAddress(w)}));
  // console.log(`allWalletsOptions: ${JSON.stringify(allWalletsOptions)}`)

  function walletSelected(theSelectedWallet) {
    // console.log(`walletSeleted: ${JSON.stringify(theSelectedWallet)}`)
    setSelectedWallet(theSelectedWallet.value)
    // getWallet(loggedInUser, theSelectedWallet.value);
  }

  return (
    <form className="container transfer" onSubmit={transfer} style={transferDialogDisabled ? {pointerEvents: "none", opacity: "0.4"} : {}}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        {/*<input*/}
        {/*  placeholder="Type an address, for example: 0x2"*/}
        {/*  value={recipient}*/}
        {/*  onChange={setValue(setRecipient)}*/}
        {/*></input>*/}
        <div>
          <Select defaultValue={selectedWallet}
                  options={allWalletsOptions}
                  onChange={walletSelected}
          />
        </div>
      </label>

      <input type="submit" className="button" value="Transfer" />
      <XMessage message={message}/>
    </form>
  );
}

export default Transfer;
