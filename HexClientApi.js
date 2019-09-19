'use strict';

const crypto = require('crypto');
const request = require('request');
const rp = require('request-promise');
const getNonce = require('./nonce.js');
class HexClientApi {
  /**
   * constructor - description
   *
   * @param  {string} apiKey client apiKey
   * @param  {string} secret client secret
   * @param  {string} host   the host url
   */
  constructor (apiKey, secret, host) {
    this.apiKey = apiKey;
    this.secret = secret;
    this.host = host;
    this.supportedMethod = ['GET', 'POST', 'DELETE', 'PATCH'];
  }


  /**
   * rest - make request
   * This method returns a Promise containing the HTTP responses
   *
   * @param  {String}   method  GET, POST, DELETE
   * @param  {String}   path    request path
   * @param  {JSON Obj} body='' A json body
   * @return {JSON Obj}         response from the server
   */

  rest (method, path, body, qs) {
    const date = new Date().toUTCString();
    const nonce = getNonce();
    const options = {};
    options['method'] = method;
    console.log(this.host);
    if (this.host === 'localhost:8000') {
      options['url'] =  `http://${this.host}${path}`;
    } else {
      options['url'] =  `https://${this.host}${path}`;
    }
    options['headers'] = {};
    options['headers']['date'] = date;
    options['headers']['host'] = this.host;
    options['headers']['nonce'] = nonce;
    options['json'] = true;

    if (method == 'POST') {
      body = body ? body : '';
      options['headers']['digest'] = this._genDigest (body);
      options['json'] = body;
    }
    if (qs) {
      options['qs'] = qs
    }
    options['headers']['authorization'] = this._genAuthorizationString (method, path, body, nonce);
    console.log(options); 
    return rp(options);
  }

  _genDigest (body) {
    let msg;
    if (body == '') {
      msg = '';
    } else {
      msg = JSON.stringify(body);
    }
    return "SHA-256=" + crypto.createHash("sha256").update(msg, 'utf-8').digest("base64");
  }

  _genSig (toSign) {
    return crypto.createHmac("sha512", this.secret).update(toSign).digest("base64");
  }

  _genAuthorizationString (method, path, body, nonce) {

    if (this.supportedMethod.indexOf (method) == -1) throw Error ('No support of this HTTP method');

    const requestLine = `${method} ${path} HTTP/1.1`;
    let stringToSign;

    if (method == 'GET' || method == 'DELETE' || method == 'PATCH') {
      stringToSign = 'nonce: ' + nonce + '\n' + 'host: ' + this.host + '\n' + requestLine;
    } else if (method == 'POST') {
      stringToSign = 'nonce: ' + nonce + '\n' + 'host: ' + this.host + '\n' + 'digest: ' + this._genDigest(body) + '\n' + requestLine;
    }
    return `hmac username="${this.apiKey}", algorithm="hmac-sha512", headers="nonce host${method == 'POST' ? ' digest ' : ' '}request-line", signature="${this._genSig(stringToSign)}"`
  }
}

module.exports = HexClientApi;
