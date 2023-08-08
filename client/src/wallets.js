import server from "./server.js"

export async function createWallet(user, thePublicKey, balance = 0) {
    try {
        const {
            data: { message },
        } = await server.post(`users/` + user + '/wallets/' + thePublicKey, {
            balance,
        });
        console.log(`createWallet - message: ${message}`)
    } catch (ex) {
        throw new Error(`Error creating new Wallet - user: ${user}, publicKey: ${thePublicKey}, balance: ${balance}`)
    }
}
