import { UrlObject } from 'url'
import crypto from 'crypto'
import { RequestMethod } from './client'

export class Utilities {

  static last: number = Utilities.getTime()

  static nonceIncr: number = -1

  static toUri(parsedUrl: UrlObject, path: string): string {
    let separator = parsedUrl.slashes ? '/' : '\\'
    return [
      `${parsedUrl.protocol}${separator}`,
      parsedUrl.host,
      parsedUrl.slashes ? path.replace(/^\//, '') : path.replace(/^\\/, '')
    ].join(separator)
  }

  static getTime(): number {
    return (new Date()).getTime()
  }

  static padding(value: any, pad: number = 3): string {
    value = value.toString()
    return `${'0'.repeat(pad - value.length)}${value}`
  }

  static getNonce(): string {
    const now = Utilities.getTime()
    if (now !== Utilities.last) {
      Utilities.nonceIncr = -1
    }
    Utilities.last = now
    Utilities.nonceIncr++
    return `${now}${Utilities.padding(Utilities.nonceIncr)}`
  }

  static genDigest(body: any): string {
    let msg: string = ''
    if (typeof (body) === 'object') {
      msg = JSON.stringify(body)
    }
    return `SHA-256=${crypto.createHash("sha256").update(msg, 'utf8').digest('base64')}`;
  }

  static genSig(toSign: any, secret: string): string {
    return crypto.createHmac("sha512", secret).update(toSign).digest("base64");
  }

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

  static timeStampHeader(options: any): any {
    options['headers']['date'] = (new Date()).toUTCString()
    return options
  }

}
