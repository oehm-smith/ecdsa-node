import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { toHex, utf8ToBytes } from "ethereum-cryptography/utils"
import { keccak256 } from "ethereum-cryptography/keccak";
import { isObject, prepareAddress } from "./Utils.js"

/**
 * This source represents the browser plugin for Public / Private keys that is normally used
 * to keep the private key secure behind a password and Secret Phrase.  In reality this will
 * be a plugin like Metamask.
 */

export default class WalletConnectSecureBrowserPlugin {
    static publicPrivateKeys = new Map();

    /**
     * Create new key pair keeping private part secure
     * @return public key portion
     */
    static createNewPublicPrivateKey() {
        const privateKey = secp256k1.utils.randomPrivateKey();
        const publicKey = secp256k1.getPublicKey(privateKey, false);

        const publicKeyHex = toHex(publicKey);
        this.publicPrivateKeys.set(publicKeyHex, privateKey);
        return publicKeyHex;
    }

    static _hashMessage (message) {
        let theMessage = message
        if (isObject(message)) {
            theMessage = JSON.stringify(message);
        }
        return keccak256(utf8ToBytes(theMessage));
    }

    static signMessage(from, to, amount) {
        const privateKey = this.publicPrivateKeys.get(from);    // from is a publicKey - to is also
        if (! privateKey) {
            const message =`No private key for public key: ${from}`
            console.error(message)
            return { message };
        }
        const transferData = {operation: "transfer", from, to, amount}
        const messageHash = this._hashMessage(transferData);
        const signature = secp256k1.sign(messageHash, privateKey); // Sync methods below
        const message = {operation: "transfer", from: prepareAddress(from), to: prepareAddress(to), amount}
        return { signature, transferData, message };
    }
}
