"use strict";
import { arrayify, hexlify } from "@wansproject/bytes";
import { Coder } from "./abstract-coder";
export class DynamicBytesCoder extends Coder {
    constructor(type, localName) {
        super(type, type, localName, true);
    }
    encode(writer, value) {
        value = arrayify(value);
        let length = writer.writeValue(value.length);
        length += writer.writeBytes(value);
        return length;
    }
    decode(reader) {
        return reader.readBytes(reader.readValue().toNumber(), true);
    }
}
export class BytesCoder extends DynamicBytesCoder {
    constructor(localName) {
        super("bytes", localName);
    }
    decode(reader) {
        return reader.coerce(this.name, hexlify(super.decode(reader)));
    }
}
//# sourceMappingURL=bytes.js.map