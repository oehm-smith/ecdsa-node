export const prepareAddress = (publicKey) => {
    if (publicKey.length > 16) {
        return "0x" + publicKey.slice(0, 6) + "..." + publicKey.slice(-6);
    }
    return publicKey;
}

// module.exports = {prepareAddress}
