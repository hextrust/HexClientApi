import requestPromise from 'request-promise-native';
export declare class HexRequest {
    private _baseURL;
    private _middleware;
    constructor(apiBaseUri: string);
    use(middleware: Function): void;
    getHost(): string;
    request(requestPath: string, otpions: any): requestPromise.RequestPromise<any>;
}
