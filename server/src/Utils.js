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

/**
 * JSON.stringify() that handles data that it normally can't
 */
const JSONStringify = (data) => {
    return JSON.stringify(data, (key, value) =>
        typeof value === 'bigint'
            ? value.toString()
            : value // return everything else unchanged
    );
}

const unserialize = (str, theClass) => {
    var instance = new theClass();                  // NOTE: if your constructor checks for unpassed arguments, then just pass dummy ones to prevent throwing an error
    var serializedObject = JSONbig.parse(str);
    Object.assign(instance, serializedObject);
    return instance;
}

class Signature {
    constructor({r, s, recovery}) {
        // const {r, s, recovery} = SigLikeObj;
        this.r = BigInt(r);
        this.s = BigInt(s);
        this.recovery = recovery;
    }
}

const fixSignatureJSON = (signature) => {
    const r = unserialize(signature.r, bigint);
    const s = unserialize(signature.s, bigint);

    return {r,s}
}


module.exports = {prepareAddress, isObject, JSONStringify, unserialize, fixSignatureJSON, Signature}
