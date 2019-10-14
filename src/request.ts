import requestPromise from 'request-promise-native';
import url, { UrlObject } from 'url';
import { Utilities } from './utilities';

/**
 * Hex Request core with middle-ware
 * @export
 * @class HexRequest
 */
export class HexRequest {
  /**
   * Base URL of endpoint
   * @private
   * @type {UrlObject}
   * @memberof HexRequest
   */
  private _baseURL: UrlObject;

  /**
   * Middle ware stack
   * @private
   * @type {Array<Function>}
   * @memberof HexRequest
   */
  private _middleware: Array<Function>;

  /**
   * Creates an instance of HexRequest.
   * @param {string} apiBaseUri
   * @memberof HexRequest
   */
  constructor(apiBaseUri: string) {
    this._baseURL = url.parse(apiBaseUri);
    this._middleware = [];
  }

  /**
   * Add middle-ware to HexRequest
   * @param {Function} middleware
   * @memberof HexRequest
   */
  public use(middleware: Function) {
    this._middleware.push(middleware);
  }

  /**
   * Get host of the endpoint
   * @returns {string}
   * @memberof HexRequest
   */
  public getHost(): string {
    //@ts-ignore
    return this._baseURL.host;
  }

  /**
   * Passing all options to request-promise-native
   * @param {string} requestPath
   * @param {*} otpions
   * @returns
   * @memberof HexRequest
   */
  public request(requestPath: string, otpions: any) {
    let requestUri = Utilities.toUri(this._baseURL, requestPath);
    for (let i = 0; i < this._middleware.length; i++) {
      otpions = this._middleware[i](otpions);
    }
    //@ts-ignore
    return requestPromise({
      uri: requestUri,
      ...otpions,
    });
  }
}
