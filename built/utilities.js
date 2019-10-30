"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
class Utilities {
    static toUri(parsedUrl, path) {
        let separator = parsedUrl.slashes ? '/' : '\\';
        return [
            `${parsedUrl.protocol}${separator}`,
            parsedUrl.host,
            parsedUrl.slashes ? path.replace(/^\//, '') : path.replace(/^\\/, '')
        ].join(separator);
    }
    static getTime() {
        return Date.now();
    }
    static padding(value, paddingChar = '0', pad = 3) {
        value = value.toString();
        return `${paddingChar.repeat(pad - value.length)}${value}`;
    }
    static getNonce() {
        let timestamp = Date.now();
        let lowBits = timestamp & 0xffff;
        let hiBits = timestamp >>> 16;
        let randomPart = 0;
        do {
            randomPart = (Math.random() * 0xffff) >>> 0;
        } while (((randomPart ^ lowBits) & Utilities.BITMASK_CHECKSUM) !== Utilities.BITMASK_CHECKSUM);
        return ((((randomPart ^ hiBits) << 16) | lowBits) >>> 0).toString(16);
    }
    static checkNone(nonce) {
        let intNonce = parseInt(nonce, 16) >>> 0;
        let lowNonce = intNonce & 0xffff;
        let hiNonce = intNonce >>> 16;
        let timestamp = Date.now();
        let lowBits = timestamp & 0xffff;
        let hiBits = timestamp >>> 16;
        return lowBits >= lowNonce
            && ((hiNonce ^ hiBits ^ lowNonce) & Utilities.BITMASK_CHECKSUM) === Utilities.BITMASK_CHECKSUM;
    }
    static genDigest(body) {
        let msg = '';
        if (typeof (body) === 'object') {
            msg = JSON.stringify(body);
        }
        return `SHA-256=${crypto_1.default.createHash("sha256").update(msg, 'utf8').digest('base64')}`;
    }
    static genSig(toSign, secret) {
        return crypto_1.default.createHmac("sha512", secret).update(toSign).digest("base64");
    }
    static genAuthorizationString(method, host, path, body, nonce, secret, apiKey) {
        const requestLine = `${method} ${path} HTTP/1.1`;
        let stringToSign;
        if (method === 'POST') {
            stringToSign = `nonce: ${nonce}\nhost: ${host}\ndigest: ${Utilities.genDigest(body)}\n${requestLine}`;
        }
        else {
            stringToSign = `nonce: ${nonce}\nhost: ${host}\n${requestLine}`;
        }
        return `hmac username="${apiKey}", algorithm="hmac-sha512", headers="nonce host${method === 'POST' ? ' digest ' : ' '}request-line", signature="${Utilities.genSig(stringToSign, secret)}"`;
    }
    static timeStampHeader(options) {
        options['headers']['date'] = (new Date()).toUTCString();
        return options;
    }
}
exports.Utilities = Utilities;
Utilities.BITMASK_CHECKSUM = 42;
