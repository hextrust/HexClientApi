/// <reference types="node" />
import { UrlObject } from 'url';
import { RequestMethod } from './client';
export declare class Utilities {
    static last: number;
    static nonceIncr: number;
    static toUri(parsedUrl: UrlObject, path: string): string;
    static getTime(): number;
    static padding(value: any, pad?: number): string;
    static getNonce(): string;
    static genDigest(body: any): string;
    static genSig(toSign: any, secret: string): string;
    static genAuthorizationString(method: RequestMethod, host: string, path: string, body: any, nonce: string, secret: string, apiKey: string): string;
    static timeStampHeader(options: any): any;
}
