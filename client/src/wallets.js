import server from "./server.js"
import { prepareAddress } from "./Utils.js"
import log from 'loglevel';

export async function createWallet(user, thePublicKey, balance = 0) {
    try {
        const {
            data: { message },
        } = await server.post(`users/` + user + '/wallets/' + thePublicKey, {
            balance,
        });
        log.info(`createWallet - for ${user} with key: ${prepareAddress(thePublicKey)} - message: ${message}`)
    } catch (ex) {
        throw new Error(`Error creating new Wallet - user: ${user}, publicKey: ${thePublicKey}, balance: ${balance}`)
    }
}
