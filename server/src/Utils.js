const JSONbig = require('json-bigint');

const prepareAddress = (key) => {
    if (key.length > 16) {
        return "0x" + key.slice(0, 6) + "..." + key.slice(-6);
    }
    return key;
}

const isObject = obj => {
    return Object.prototype.toString.call(obj) === '[object Object]'
}

module.exports = {prepareAddress, isObject}
