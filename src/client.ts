import { HexRequest } from './request';
import { Utilities } from './utilities';

/**
 * HTTP Request methods
 * @export
 * @enum {string}
 */
export enum RequestMethod {
  GET = 'GET',
  POST = 'POST',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
  PUT = 'PUT',
}

/**
 * Hex configuration
 * @interface HexApiConfig
 */
interface HexApiConfig {
  apiKey: string;
  secret: string;
  endPoint: string;
}

/**
 * Hex API Client
 * @export
 * @class HexApiClient
 */
export class HexClientApi {
  /**
   * Hex configuration
   * @private
   * @type {HexApiConfig}
   * @memberof HexApiClient
   */
  private _config: HexApiConfig;

  /**
   * Hex Request Client
   * @private
   * @type {HexRequest}
   * @memberof HexApiClient
   */
  private _rqClient: HexRequest;

  /**
   * Creates an instance of HexApiClient.
   * @param {string} endPoint HexAPI enpoint, should be an URI
   * @param {string} apiKey API key
   * @param {string} secret API secret
   * @memberof HexApiClient
   */
  constructor(endPoint: string, apiKey: string, secret: string) {
    this._config = {
      apiKey,
      secret,
      endPoint,
    };
    //Create new instance of HexRequest
    this._rqClient = new HexRequest(endPoint);
    //Apply middle ware for timestamp header
    this._rqClient.use(Utilities.timeStampHeader);
  }

  /**
   * Send GET request to API endpoint
   * @param {string} path API route, /api/v1/account
   * @param {*} [qs=null]
   * @returns {Promise<any>}
   * @memberof HexApiClient
   */
  public get(path: string, qs: any = null): Promise<any> {
    return this._request(RequestMethod.GET, path, '', qs);
  }

  /**
   * Send DELETE request to API endpoint
   * @param {string} path
   * @param {*} [qs=null]
   * @returns {Promise<any>}
   * @memberof HexApiClient
   */
  public delete(path: string, qs: any = null): Promise<any> {
    return this._request(RequestMethod.DELETE, path, '', qs);
  }

  /**
   * Send PATCH request to API endpoint
   * @param {string} path
   * @param {*} [qs=null]
   * @returns {Promise<any>}
   * @memberof HexApiClient
   */
  public patch(path: string, qs: any = null): Promise<any> {
    return this._request(RequestMethod.PATCH, path, '', qs);
  }

  /**
   * Send POST request to API endpoint
   * @param {string} path
   * @param {*} body Request body
   * @param {*} [qs=null]
   * @returns {Promise<any>}
   * @memberof HexApiClient
   */
  public post(path: string, body: any, qs: any = null): Promise<any> {
    return this._request(RequestMethod.POST, path, body, qs);
  }

  /**
   * Private method, handle all methods
   * @private
   * @param {RequestMethod} method
   * @param {string} path
   * @param {*} [body='']
   * @param {*} qs
   * @returns {Promise<any>}
   * @memberof HexApiClient
   */
  private _request(method: RequestMethod, path: string, body: any = '', qs: any): Promise<any> {
    let options: any = {
      method,
      headers: {
        nonce: Utilities.getNonce(),
      },
      json: true,
    };
    if (method === 'POST') {
      options['headers']['digest'] = Utilities.genDigest(body);
      options['body'] = body;
    }
    if (qs) {
      options['qs'] = qs;
    }
    options['headers']['authorization'] = Utilities.genAuthorizationString(
      method,
      this._rqClient.getHost(),
      path,
      body,
      options['headers']['nonce'],
      this._config.secret,
      this._config.apiKey
    );
    return this._rqClient.request(path, options);
  }
}
