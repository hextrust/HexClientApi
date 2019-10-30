/// <reference types="node" />
import { UrlObject } from 'url';
import { RequestMethod } from './client';
export declare class Utilities {
    static BITMASK_CHECKSUM: number;
    static toUri(parsedUrl: UrlObject, path: string): string;
    static getTime(): number;
    static padding(value: any, paddingChar?: string, pad?: number): string;
    static getNonce(): string;
    static checkNone(nonce: string): boolean;
    static genDigest(body: any): string;
    static genSig(toSign: any, secret: string): string;
    static genAuthorizationString(method: RequestMethod, host: string, path: string, body: any, nonce: string, secret: string, apiKey: string): string;
    static timeStampHeader(options: any): any;
}
