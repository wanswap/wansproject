import { Network } from "@wansproject/networks";
import { UrlJsonRpcProvider } from "./url-json-rpc-provider";
export declare class NodesmithProvider extends UrlJsonRpcProvider {
    static getApiKey(apiKey: any): any;
    static getUrl(network: Network, apiKey?: any): string;
}
