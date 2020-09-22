import { ExternallyOwnedAccount } from "@wansproject/abstract-signer";
import { Bytes, BytesLike } from "@wansproject/bytes";
import { Mnemonic } from "@wansproject/hdnode";
import { Description } from "@wansproject/properties";
export interface _KeystoreAccount {
    address: string;
    privateKey: string;
    mnemonic?: Mnemonic;
    _isKeystoreAccount: boolean;
}
export declare class KeystoreAccount extends Description<_KeystoreAccount> implements ExternallyOwnedAccount {
    readonly address: string;
    readonly privateKey: string;
    readonly mnemonic?: Mnemonic;
    readonly _isKeystoreAccount: boolean;
    isKeystoreAccount(value: any): value is KeystoreAccount;
}
export declare type ProgressCallback = (percent: number) => void;
export declare type EncryptOptions = {
    iv?: BytesLike;
    entropy?: BytesLike;
    client?: string;
    salt?: BytesLike;
    uuid?: string;
    scrypt?: {
        N?: number;
        r?: number;
        p?: number;
    };
};
export declare function decryptSync(json: string, password: Bytes | string): KeystoreAccount;
export declare function decrypt(json: string, password: Bytes | string, progressCallback?: ProgressCallback): Promise<KeystoreAccount>;
export declare function encrypt(account: ExternallyOwnedAccount, password: Bytes | string, options?: EncryptOptions, progressCallback?: ProgressCallback): Promise<string>;
