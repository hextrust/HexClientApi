import { UrlObject } from 'url'
import crypto from 'crypto'
import { RequestMethod } from './client'

/**
 * Utilities to sign and manipulate data
 * @export
 * @class Utilities
 */
export class Utilities {

  /**
   * Nonce bitmask checksum 
   * 101010
   * @static
   * @memberof Utilities
   */
  static BITMASK_CHECKSUM = 42

  /**
   * Forging URi
   * @static
   * @param {UrlObject} parsedUrl
   * @param {string} path
   * @returns {string}
   * @memberof Utilities
   */
  static toUri(parsedUrl: UrlObject, path: string): string {
    let separator = parsedUrl.slashes ? '/' : '\\'
    return [
      `${parsedUrl.protocol}${separator}`,
      parsedUrl.host,
      parsedUrl.slashes ? path.replace(/^\//, '') : path.replace(/^\\/, '')
    ].join(separator)
  }

  /**
   * Shorten for timestamp
   * @static
   * @returns {number}
   * @memberof Utilities
   */
  static getTime(): number {
    return Date.now()
  }

  /**
   * Add padding characters
   * @static
   * @param {*} value
   * @param {string} [paddingChar='0']
   * @param {number} [pad=3]
   * @returns {string}
   * @memberof Utilities
   */
  static padding(value: any, paddingChar: string = '0', pad: number = 3): string {
    value = value.toString()
    return `${paddingChar.repeat(pad - value.length)}${value}`
  }

  /**
   * Generate nonce number
   * @static
   * @returns {string}
   * @memberof Utilities
   */
  static getNonce(): string {
    let timestamp = Date.now()
    let lowBits = timestamp & 0xffff
    let hiBits = timestamp >>> 16
    let randomPart = 0
    do {
      randomPart = (Math.random() * 0xffff) >>> 0
    }
    while (((randomPart ^ lowBits) & Utilities.BITMASK_CHECKSUM) !== Utilities.BITMASK_CHECKSUM)
    return ((((randomPart ^ hiBits) << 16) | lowBits) >>> 0).toString(16)
  }

  /**
   * Validating nonce value
   * @static
   * @param {string} nonce
   * @returns {boolean}
   * @memberof Utilities
   */
  static checkNone(nonce: string): boolean {
    let intNonce = parseInt(nonce, 16) >>> 0
    let lowNonce = intNonce & 0xffff
    let hiNonce = intNonce >>> 16
    let timestamp = Date.now()
    let lowBits = timestamp & 0xffff
    let hiBits = timestamp >>> 16
    return lowBits >= lowNonce
      && ((hiNonce ^ hiBits ^ lowNonce) & Utilities.BITMASK_CHECKSUM) === Utilities.BITMASK_CHECKSUM
  }

  /**
   * Generate content digest
   * @static
   * @param {*} body
   * @returns {string}
   * @memberof Utilities
   */
  static genDigest(body: any): string {
    let msg: string = ''
    if (typeof (body) === 'object') {
      msg = JSON.stringify(body)
    }
    return `SHA-256=${crypto.createHash("sha256").update(msg, 'utf8').digest('base64')}`;
  }

  /**
   * Signed the given data
   * @static
   * @param {*} toSign
   * @param {string} secret
   * @returns {string}
   * @memberof Utilities
   */
  static genSig(toSign: any, secret: string): string {
    return crypto.createHmac("sha512", secret).update(toSign).digest("base64");
  }

  /**
   * Generate authorization string
   * @static
   * @param {RequestMethod} method
   * @param {string} host
   * @param {string} path
   * @param {*} body
   * @param {string} nonce
   * @param {string} secret
   * @param {string} apiKey
   * @returns
   * @memberof Utilities
   */
  static genAuthorizationString(method: RequestMethod, host: string, path: string, body: any, nonce: string, secret: string, apiKey: string) {
    const requestLine: string = `${method} ${path} HTTP/1.1`
    let stringToSign: string
    if (method === 'POST') {
      stringToSign = `nonce: ${nonce}\nhost: ${host}\ndigest: ${Utilities.genDigest(body)}\n${requestLine}`
    } else {
      stringToSign = `nonce: ${nonce}\nhost: ${host}\n${requestLine}`
    }
    return `hmac username="${apiKey}", algorithm="hmac-sha512", headers="nonce host${method === 'POST' ? ' digest ' : ' '}request-line", signature="${Utilities.genSig(stringToSign, secret)}"`
  }

  /**
   * Middle-ware add timestamp to header
   * @static
   * @param {*} options
   * @returns {*}
   * @memberof Utilities
   */
  static timeStampHeader(options: any): any {
    options['headers']['date'] = (new Date()).toUTCString()
    return options
  }

}
