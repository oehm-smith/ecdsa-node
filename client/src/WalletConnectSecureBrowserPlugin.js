import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { toHex, utf8ToBytes } from "ethereum-cryptography/utils"
import { keccak256 } from "ethereum-cryptography/keccak";
import { isObject, prepareAddress } from "./Utils.js"
import log from 'loglevel';

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
        log.info(`Create public key: ${prepareAddress(publicKeyHex)} with private key: ${prepareAddress(toHex(privateKey))}`)
        log.debug(`  Now have this many public keys: ${this.publicPrivateKeys.size}`)
        return publicKeyHex;
    }

    static _hashMessage (message) {
        let theMessage = message
        if (isObject(message)) {
            theMessage = JSON.stringify(message);
        }
        return keccak256(utf8ToBytes(theMessage));
    }

    static signMessage(action, publicKey) {
        const privateKey = this.publicPrivateKeys.get(publicKey);
        if (! privateKey) {
            const message =`No private key for public key: ${action.from}`
            console.error(message)
            return { message };
        }
        const actionHash = this._hashMessage(action);
        const signature = secp256k1.sign(actionHash, privateKey); // Sync methods below
        const message = {operation: "transfer", from: prepareAddress(action.from), to: prepareAddress(action.to), amount: action.amount}
        return { signature, message };
    }
}
