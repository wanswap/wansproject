"use strict";
import { Contract, ContractFactory } from "@wansproject/contracts";
import { BigNumber, FixedNumber } from "@wansproject/bignumber";
import { Signer, VoidSigner } from "@wansproject/abstract-signer";
import { Wallet } from "@wansproject/wallet";
import * as constants from "@wansproject/constants";
import * as providers from "@wansproject/providers";
import { getDefaultProvider } from "@wansproject/providers";
import { Wordlist, wordlists } from "@wansproject/wordlists";
import * as utils from "./utils";
import { ErrorCode as errors, Logger } from "@wansproject/logger";
////////////////////////
// Compile-Time Constants
// This is generated by "npm run dist"
import { version } from "./_version";
const logger = new Logger(version);
////////////////////////
// Exports
export { Signer, Wallet, VoidSigner, getDefaultProvider, providers, Contract, ContractFactory, BigNumber, FixedNumber, constants, errors, logger, utils, wordlists, 
////////////////////////
// Compile-Time Constants
version, Wordlist };
//# sourceMappingURL=ethers.js.map