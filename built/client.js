"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request_1 = require("./request");
const utilities_1 = require("./utilities");
var RequestMethod;
(function (RequestMethod) {
    RequestMethod["GET"] = "GET";
    RequestMethod["POST"] = "POST";
    RequestMethod["DELETE"] = "DELETE";
    RequestMethod["PATCH"] = "PATCH";
    RequestMethod["PUT"] = "PUT";
})(RequestMethod = exports.RequestMethod || (exports.RequestMethod = {}));
class HexApiClient {
    constructor(endPoint, apiKey, secret) {
        this._config = {
            apiKey,
            secret,
            endPoint
        };
        this._rqClient = new request_1.HexRequest(endPoint);
        this._rqClient.use(utilities_1.Utilities.timeStampHeader);
    }
    get(path, qs = null) {
        return this._request(RequestMethod.GET, path, '', qs);
    }
    delete(path, qs = null) {
        return this._request(RequestMethod.DELETE, path, '', qs);
    }
    patch(path, qs = null) {
        return this._request(RequestMethod.PATCH, path, '', qs);
    }
    post(path, body, qs = null) {
        return this._request(RequestMethod.POST, path, body, qs);
    }
    _request(method, path, body = '', qs) {
        let options = {
            method,
            headers: {
                nonce: utilities_1.Utilities.getNonce()
            },
            json: true
        };
        if (method === 'POST') {
            options['headers']['digest'] = utilities_1.Utilities.genDigest(body);
            options['body'] = body;
        }
        if (qs) {
            options['qs'] = qs;
        }
        options['headers']['authorization'] = utilities_1.Utilities.genAuthorizationString(method, this._rqClient.getHost(), path, body, options['headers']['nonce'], this._config.secret, this._config.apiKey);
        return this._rqClient.request(path, options);
    }
}
exports.HexApiClient = HexApiClient;
