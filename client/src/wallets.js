import server from "./server.js"

export async function createWallet(user, thePublicKey, balance = 0) {
    try {
        const {
            data: { message },
        } = await server.post(`users/` + user + '/wallets/' + thePublicKey, {
            balance,
        });
        console.log(`createWallet - message: ${message}`)
        // loadUserWallets();
    } catch (ex) {
        if (ex.response) {
            alert(ex.response.data.message);
        } else {
            alert(ex);
        }
    }
}
