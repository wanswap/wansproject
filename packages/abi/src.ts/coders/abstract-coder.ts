"use strict";

import { arrayify, BytesLike, concat, hexlify } from "@wansproject/bytes";
import { BigNumber, BigNumberish } from "@wansproject/bignumber";
import { defineReadOnly } from "@wansproject/properties";

import { Logger } from "@wansproject/logger";
import { version } from "../_version";
const logger = new Logger(version);

export interface Result extends ReadonlyArray<any> {
    readonly [key: string]: any;
}

export function checkResultErrors(result: Result): Array<{ path: Array<string | number>, error: Error }> {
    // Find the first error (if any)
    const errors: Array<{ path: Array<string | number>, error: Error }> = [ ];

    const checkErrors = function(path: Array<string | number>, object: any): void {
        if (!Array.isArray(object)) { return; }
        for (let key in object) {
            const childPath = path.slice();
            childPath.push(key);

            try {
                 checkErrors(childPath, object[key]);
            } catch (error) {
                errors.push({ path: childPath, error: error });
            }
        }
    }
    checkErrors([ ], result);

    return errors;

}

export type CoerceFunc = (type: string, value: any) => any;

export abstract class Coder {

    // The coder name:
    //   - address, uint256, tuple, array, etc.
    readonly name: string;

    // The fully expanded type, including composite types:
    //   - address, uint256, tuple(address,bytes), uint256[3][4][],  etc.
    readonly type: string;

    // The localName bound in the signature, in this example it is "baz":
    //   - tuple(address foo, uint bar) baz
    readonly localName: string;

    // Whether this type is dynamic:
    //  - Dynamic: bytes, string, address[], tuple(boolean[]), etc.
    //  - Not Dynamic: address, uint256, boolean[3], tuple(address, uint8)
    readonly dynamic: boolean;

    constructor(name: string, type: string, localName: string, dynamic: boolean) {
        // @TODO: defineReadOnly these
        this.name = name;
        this.type = type;
        this.localName = localName;
        this.dynamic = dynamic;
    }

    _throwError(message: string, value: any): void {
        logger.throwArgumentError(message, this.localName, value);
    }

    abstract encode(writer: Writer, value: any): number;
    abstract decode(reader: Reader): any;
}

export class Writer {
    readonly wordSize: number;

    _data: Uint8Array;
    _padding: Uint8Array;

    constructor(wordSize?: number) {
        defineReadOnly(this, "wordSize", wordSize || 32);
        this._data = arrayify([ ]);
        this._padding = new Uint8Array(wordSize);
    }

    get data(): string { return hexlify(this._data); }
    get length(): number { return this._data.length; }

    _writeData(data: Uint8Array): number {
        this._data = concat([ this._data, data ]);
        return data.length;
    }

    // Arrayish items; padded on the right to wordSize
    writeBytes(value: BytesLike): number {
        let bytes = arrayify(value);
        if (bytes.length % this.wordSize) {
            bytes = concat([ bytes, this._padding.slice(bytes.length % this.wordSize) ])
        }
        return this._writeData(bytes);
    }

    _getValue(value: BigNumberish): Uint8Array {
        let bytes = arrayify(BigNumber.from(value));
        if (bytes.length > this.wordSize) {
            logger.throwError("value out-of-bounds", Logger.errors.BUFFER_OVERRUN, {
                length: this.wordSize,
                offset: bytes.length
            });
        }
        if (bytes.length % this.wordSize) {
            bytes = concat([ this._padding.slice(bytes.length % this.wordSize), bytes ]);
        }
        return bytes;
    }

    // BigNumberish items; padded on the left to wordSize
    writeValue(value: BigNumberish): number {
        return this._writeData(this._getValue(value));
    }

    writeUpdatableValue(): (value: BigNumberish) => void {
        let offset = this.length;
        this.writeValue(0);
        return (value: BigNumberish) => {
            this._data.set(this._getValue(value), offset);
        };
    }
}

export class Reader {
    readonly wordSize: number;
    readonly allowLoose: boolean;

    readonly _data: Uint8Array;
    readonly _coerceFunc: CoerceFunc;

    _offset: number;

    constructor(data: BytesLike, wordSize?: number, coerceFunc?: CoerceFunc, allowLoose?: boolean) {
        defineReadOnly(this, "_data", arrayify(data));
        defineReadOnly(this, "wordSize", wordSize || 32);
        defineReadOnly(this, "_coerceFunc", coerceFunc);
        defineReadOnly(this, "allowLoose", allowLoose);

        this._offset = 0;
    }

    get data(): string { return hexlify(this._data); }
    get consumed(): number { return this._offset; }

    // The default Coerce function
    static coerce(name: string, value: any): any {
        let match = name.match("^u?int([0-9]+)$");
        if (match && parseInt(match[1]) <= 48) { value =  value.toNumber(); }
        return value;
    }

    coerce(name: string, value: any): any {
        if (this._coerceFunc) { return this._coerceFunc(name, value); }
        return Reader.coerce(name, value);
    }

    _peekBytes(offset: number, length: number, loose?: boolean): Uint8Array {
        let alignedLength = Math.ceil(length / this.wordSize) * this.wordSize;
        if (this._offset + alignedLength > this._data.length) {
            if (this.allowLoose && loose && this._offset + length <= this._data.length) {
                alignedLength = length;
            } else {
                logger.throwError("data out-of-bounds", Logger.errors.BUFFER_OVERRUN, {
                    length: this._data.length,
                    offset: this._offset + alignedLength
                });
            }
        }
        return this._data.slice(this._offset, this._offset + alignedLength)
    }

    subReader(offset: number): Reader {
        return new Reader(this._data.slice(this._offset + offset), this.wordSize, this._coerceFunc, this.allowLoose);
    }

    readBytes(length: number, loose?: boolean): Uint8Array {
        let bytes = this._peekBytes(0, length, !!loose);
        this._offset += bytes.length;
        // @TODO: Make sure the length..end bytes are all 0?
        return bytes.slice(0, length);
    }

    readValue(): BigNumber {
        return BigNumber.from(this.readBytes(this.wordSize));
    }
}
