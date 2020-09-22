import { BigNumber, BigNumberish } from "@wansproject/bignumber";
import { BytesLike, SignatureLike } from "@wansproject/bytes";
export declare type UnsignedTransaction = {
    Txtype?: string;
    to?: string;
    nonce?: number;
    gasLimit?: BigNumberish;
    gasPrice?: BigNumberish;
    data?: BytesLike;
    value?: BigNumberish;
    chainId?: number;
};
export interface Transaction {
    Txtype?: string;
    hash?: string;
    to?: string;
    from?: string;
    nonce: number;
    gasLimit: BigNumber;
    gasPrice: BigNumber;
    data: string;
    value: BigNumber;
    chainId: number;
    r?: string;
    s?: string;
    v?: number;
}
export declare function computeAddress(key: BytesLike | string): string;
export declare function recoverAddress(digest: BytesLike, signature: SignatureLike): string;
export declare function serialize(transaction: UnsignedTransaction, signature?: SignatureLike): string;
export declare function parse(rawTransaction: BytesLike): Transaction;
