const { secp256k1 } = require("ethereum-cryptography/secp256k1");
// const toHex = require("ethereum-cryptography/utils");
const { utf8ToBytes } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { fixSignatureJSON, unserialize, Signature } = require("./Utils")
const { isObject } = require("./Utils");

/**
 * This source represents the browser plugin for Public / Private keys that is normally used
 * to keep the private key secure behind a password and Secret Phrase.  In reality this will
 * be a plugin like Metamask.
 */

class Cryptography {
    static publicPrivateKeys = new Map();

    /**
     * Create new key pair keeping private part secure
     * @return public key portion
     */
    static createNewPublicPrivateKey() {
        const privateKey = secp256k1.secp256k1.utils.randomPrivateKey();
        const publicKey = secp256k1.secp256k1.getPublicKey(privateKey, false);

        this.publicPrivateKeys.set(publicKey, privateKey);
        return utils.toHex(publicKey);
    }

    static _hashMessage (message) {
        let theMessage = message
        if (isObject(message)) {
            theMessage = JSON.stringify(message);
        }
        return keccak256(utf8ToBytes(theMessage));
    }

    static signMessage(publicKey) {
        const privateKey = map.get(toHex(publicKey));
        if (! privateKey) {
            console.error(`No private key for public key: ${publicKey}`)
            return null;
        }
        const messageHash = this._hashMessage(JSON.stringify(message));
        const signature = secp256k1.sign(messageHash, privateKey); // Sync methods below
        return signature;
    }

    static verify(signature, message, publicKey) {
        const messageHash = this._hashMessage(message);

        // Signature is json and need to reconstruct a signature that has two fields - r and s and they are both bigints
        const signatureFixed = new Signature(signature);
        return secp256k1.verify(signatureFixed, messageHash, publicKey);
    }
}

module.exports = Cryptography;
