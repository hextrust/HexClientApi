"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
class Utilities {
    static toUri(parsedUrl, path) {
        const separator = parsedUrl.slashes ? '/' : '\\';
        return [
            `${parsedUrl.protocol}${separator}`,
            parsedUrl.host,
            parsedUrl.slashes ? path.replace(/^\//, '') : path.replace(/^\\/, ''),
        ].join(separator);
    }
    static getTime() {
        return new Date().getTime();
    }
    static padding(value, paddingChar = '0', pad = 4) {
        value = value.toString();
        return `${paddingChar.repeat(pad - value.length)}${value}`;
    }
    static getNonce() {
        const now = Utilities.getTime();
        if (now !== Utilities.last) {
            Utilities.nonceIncr = -1;
        }
        Utilities.last = now;
        Utilities.nonceIncr++;
        return `${now}${Utilities.padding(Utilities.nonceIncr)}`;
    }
    static genDigest(body) {
        let msg = '';
        if (typeof body === 'object') {
            msg = JSON.stringify(body);
        }
        return `SHA-256=${crypto_1.default
            .createHash('sha256')
            .update(msg, 'utf8')
            .digest('base64')}`;
    }
    static genSig(toSign, secret) {
        return crypto_1.default
            .createHmac('sha512', secret)
            .update(toSign)
            .digest('base64');
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
        options.headers.date = new Date().toUTCString();
        return options;
    }
}
exports.Utilities = Utilities;
Utilities.last = Utilities.getTime();
Utilities.nonceIncr = -1;
