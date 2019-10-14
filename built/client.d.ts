export declare enum RequestMethod {
    GET = "GET",
    POST = "POST",
    DELETE = "DELETE",
    PATCH = "PATCH",
    PUT = "PUT"
}
export declare class HexClientApi {
    private _config;
    private _rqClient;
    constructor(endPoint: string, apiKey: string, secret: string);
    get(path: string, qs?: any): Promise<any>;
    delete(path: string, qs?: any): Promise<any>;
    patch(path: string, qs?: any): Promise<any>;
    post(path: string, body: any, qs?: any): Promise<any>;
    private _request;
}
