export const prepareAddress = (key) => {
    if (key.length > 16) {
        return "0x" + key.slice(0, 6) + "..." + key.slice(-6);
    }
    return key;
}

export const isObject = obj => {
    return Object.prototype.toString.call(obj) === '[object Object]'
}
