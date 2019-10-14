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
   * Last triggered timestamp
   * @static
   * @type {number}
   * @memberof Utilities
   */
  static last: number = Utilities.getTime()

  /**
   * Increment value
   * @static
   * @type {number}
   * @memberof Utilities
   */
  static nonceIncr: number = -1

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
    return (new Date()).getTime()
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
   * Generate valid nonce number
   * @static
   * @returns {string}
   * @memberof Utilities
   */
  static getNonce(): string {
    const now = Utilities.getTime()
    if (now !== Utilities.last) {
      Utilities.nonceIncr = -1
    }
    Utilities.last = now
    Utilities.nonceIncr++
    return `${now}${Utilities.padding(Utilities.nonceIncr)}`
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
