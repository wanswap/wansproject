'use strict';

import assert from "assert";
import { resolve } from "path";
import fs from "fs";
import { solc } from "@wansproject/cli";

describe('Test solc', function () {

    it('compiles contracts with imported library', function () {
        this.timeout(1200000);
        const filename = resolve(__dirname, '../contracts/test-solc/consumer.sol');
        const source = fs.readFileSync(filename).toString();
        const code = solc.compile(source, { filename, optimize: true })
            .filter(((contract: any) => contract.name === 'Consumer'))[0];
        const { bytecode, interface: iface } = code;
        assert(bytecode.length > 2, 'The bytecode should should have a length');
        assert(bytecode.startsWith('0x'), 'The bytecode should start with 0x');
        assert(iface.functions['f()'], 'The interface should have function f()');
    });

});
