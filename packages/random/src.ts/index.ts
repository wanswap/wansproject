"use strict";

import { randomBytes as _randomBytes } from "crypto";

import { arrayify } from "@wansproject/bytes";

export { shuffled } from "./shuffle";

export function randomBytes(length: number): Uint8Array {
    return arrayify(_randomBytes(length));
}

