"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_promise_native_1 = __importDefault(require("request-promise-native"));
const url_1 = __importDefault(require("url"));
const utilities_1 = require("./utilities");
class HexRequest {
    constructor(apiBaseUri) {
        this._baseURL = url_1.default.parse(apiBaseUri);
        this._middleware = [];
    }
    use(middleware) {
        this._middleware.push(middleware);
    }
    getHost() {
        return this._baseURL.host;
    }
    request(requestPath, otpions) {
        let requestUri = utilities_1.Utilities.toUri(this._baseURL, requestPath);
        for (let i = 0; i < this._middleware.length; i++) {
            otpions = this._middleware[i](otpions);
        }
        return request_promise_native_1.default(Object.assign({ uri: requestUri }, otpions));
    }
}
exports.HexRequest = HexRequest;
