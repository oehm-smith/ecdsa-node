export const prepareAddress = (key) => {
    if (key.length > 16) {
        return "0x" + key.slice(0, 6) + "..." + key.slice(-6);
    }
    return key;
}

export const isObject = obj => {
    return Object.prototype.toString.call(obj) === '[object Object]'
}

/**
 * JSON.stringify() that handles data that it normally can't
 */
export const JSONStringify = (data) => {
    return JSON.stringify(data, (key, value) =>
        typeof value === 'bigint'
            ? value.toString()
            : value // return everything else unchanged
    );
}
// module.exports = {prepareAddress}
