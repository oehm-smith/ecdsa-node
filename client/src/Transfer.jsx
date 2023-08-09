import React, { useEffect, useState } from "react";
import log from 'loglevel';
import { toast } from 'react-toastify';

import server from "./server";
import Select from "react-select"
import XMessage from "./XMessage.jsx"
import { prepareAddress } from "./Utils.js"
import WalletConnectSecureBrowserPlugin from "./WalletConnectSecureBrowserPlugin.js"
import JSONbig from "json-bigint"

function Transfer({ publicKey, balance, setBalance, loggedInUser, transferDialogDisabled, setTransferDialogDisabled, isNewWallet, setIsNewWallet }) {
  const [message, setMessage] = useState("");
  const [sendAmount, setSendAmount] = useState("");
  const [allWallets, setAllWallets] = useState([]);
  const [selectedWallet, setSelectedWallet] = useState('');

  useEffect( () => {
    async function doIt(){
      await getAllWallets();
    }
    doIt();
  }, [publicKey, isNewWallet])

  useEffect(() => {
    if (balance == 0) {
      setTransferDialogDisabled(true);
    }
  }, [balance])

  const setValue = (setter) => (evt) => setter(evt.target.value);

  function displaySuccessNotification(message) {
    toast(`Transfer ${message.amount} from ${message.from} to ${message.to}`);
  }

  function displayNotEnoughFundsNotification(from, amount) {
    toast(`Unable to transfer ${amount} from ${from} - not enough funds (only has ${balance})`);
  }

  async function performTransfer() {
    const action = {operation: "transfer", from: publicKey, to: selectedWallet, amount: sendAmount}
    const {  signature, message } = WalletConnectSecureBrowserPlugin.signMessage(action, publicKey);
    if (balance - sendAmount < 0) {
      displayNotEnoughFundsNotification(prepareAddress(publicKey), sendAmount);
      return;
    }
    if (message) {
      displaySuccessNotification(message);
    }
    log.info(JSON.stringify(message))
    const signature2 = JSONbig.stringify(signature);
    try {
      const url = `users/${loggedInUser}/wallets/${publicKey}/transfer`;
      const response = await server.post(url, {
        action,
        signature:signature2
      });
      console.log(`status: ${response.status}`)
    } catch (ex) {
      log.error(ex);
    }
  }

  async function transfer(evt) {
    evt.preventDefault();
    performTransfer();
    setIsNewWallet(true); // force a refresh
  }
    async function getAllWallets() {
    try {
      const {
        data: { message, wallets },
      } = await server.get(`users/wallets`);
      setAllWallets(wallets.filter(w => w !== publicKey));
    } catch (ex) {
      log.error(`getAllWallets error response: ${ex}`)
      return null;
    }
  }

  const allWalletsOptions = allWallets.map(w => ({value: w, label: prepareAddress(w)}));

  function walletSelected(theSelectedWallet) {
    setSelectedWallet(theSelectedWallet.value)
  }

  return (
    <form className="container transfer" onSubmit={transfer} style={transferDialogDisabled ? {pointerEvents: "none", opacity: "0.4"} : {}}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
      </label>
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>

      <label>
        Recipient
      </label>
        <div>
          <Select defaultValue={selectedWallet}
                  options={allWalletsOptions}
                  onChange={walletSelected}
          />
        </div>

      <input type="submit" className="button" value="Transfer" />
      <XMessage message={message}/>
    </form>
  );
}

export default Transfer;
