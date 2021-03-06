import { Provider, TransactionRequest } from "@wansproject/abstract-provider";
import { ExternallyOwnedAccount, Signer } from "@wansproject/abstract-signer";
import { Bytes, BytesLike, SignatureLike } from "@wansproject/bytes";
import { Mnemonic } from "@wansproject/hdnode";
import { SigningKey } from "@wansproject/signing-key";
import { ProgressCallback } from "@wansproject/json-wallets";
import { Wordlist } from "@wansproject/wordlists";
export declare class Wallet extends Signer implements ExternallyOwnedAccount {
    readonly address: string;
    readonly provider: Provider;
    readonly _signingKey: () => SigningKey;
    readonly _mnemonic: () => Mnemonic;
    constructor(privateKey: BytesLike | ExternallyOwnedAccount | SigningKey, provider?: Provider);
    get mnemonic(): Mnemonic;
    get privateKey(): string;
    get publicKey(): string;
    getAddress(): Promise<string>;
    connect(provider: Provider): Wallet;
    signTransaction(transaction: TransactionRequest): Promise<string>;
    signMessage(message: Bytes | string): Promise<string>;
    encrypt(password: Bytes | string, options?: any, progressCallback?: ProgressCallback): Promise<string>;
    /**
     *  Static methods to create Wallet instances.
     */
    static createRandom(options?: any): Wallet;
    static fromEncryptedJson(json: string, password: Bytes | string, progressCallback?: ProgressCallback): Promise<Wallet>;
    static fromEncryptedJsonSync(json: string, password: Bytes | string): Wallet;
    static fromMnemonic(mnemonic: string, path?: string, wordlist?: Wordlist): Wallet;
}
export declare function verifyMessage(message: Bytes | string, signature: SignatureLike): string;
