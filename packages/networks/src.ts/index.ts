"use strict";

import { Logger } from "@wansproject/logger";
import { version } from "./_version";
const logger = new Logger(version);

import { Network, Networkish } from "./types";

export {
    Network,
    Networkish
};

type DefaultProviderFunc = (providers: any, options?: any) => any;

interface Renetworkable extends DefaultProviderFunc {
    renetwork: (network: Network) => DefaultProviderFunc;
};

function isRenetworkable(value: any): value is Renetworkable {
    return (value && typeof(value.renetwork) === "function");
}

function ethDefaultProvider(network: string | Network): Renetworkable {
    const func = function(providers: any, options?: any): any {
        if (options == null) { options = { }; }
        const providerList: Array<any> = [];

        if (providers.InfuraProvider) {
            try {
                providerList.push(new providers.InfuraProvider(network, options.infura));
            } catch(error) { }
        }

        if (providers.EtherscanProvider) {
            try {
                providerList.push(new providers.EtherscanProvider(network, options.etherscan));
            } catch(error) { }
        }

        if (providers.AlchemyProvider) {
            try {
                providerList.push(new providers.AlchemyProvider(network, options.alchemy));
            } catch(error) { }
        }

        if (providers.CloudflareProvider) {
            try {
                providerList.push(new providers.CloudflareProvider(network));
            } catch(error) { }
        }

        if (providerList.length === 0) { return null; }

        if (providers.FallbackProvider) {
            let quorum = 1;
            if (options.quorum != null) {
                quorum = options.quorum;
            } else if (network === "homestead") {
                quorum = 2;
            }
            return new providers.FallbackProvider(providerList, quorum);
        }

        return providerList[0];
    };

    func.renetwork = function(network: Network) {
        return ethDefaultProvider(network);
    };

    return func;
}

function etcDefaultProvider(url: string, network: string | Network): Renetworkable {
    const func = function(providers: any, options?: any): any {
        if (providers.JsonRpcProvider) {
            return new providers.JsonRpcProvider(url, network);
        }

        return null;
    };

    func.renetwork = function(network: Network) {
        return etcDefaultProvider(url, network);
    };

    return func;
}

const homestead: Network = {
    chainId: 1,
    ensAddress: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
    name: "homestead",
    _defaultProvider: ethDefaultProvider("homestead")
};

const ropsten: Network = {
    chainId: 3,
    ensAddress: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
    name: "ropsten",
    _defaultProvider: ethDefaultProvider("ropsten")
};

const classicMordor: Network = {
    chainId: 63,
    name: "classicMordor",
    _defaultProvider: etcDefaultProvider("https://www.ethercluster.com/mordor", "classicMordor")
};

const networks: { [name: string]: Network } = {
    unspecified: {
        chainId: 0,
        name: "unspecified"
    },

    homestead: homestead,
    mainnet: homestead,

    morden: {
        chainId: 2,
        name: "morden"
    },

    ropsten: ropsten,
    testnet: ropsten,

    rinkeby: {
        chainId: 4,
        ensAddress: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
        name: "rinkeby",
        _defaultProvider: ethDefaultProvider("rinkeby")
    },

    kovan: {
        chainId: 42,
        name: "kovan",
        _defaultProvider: ethDefaultProvider("kovan")
    },

    goerli: {
        chainId: 5,
        ensAddress: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
        name: "goerli",
        _defaultProvider: ethDefaultProvider("goerli")
     },


    // ETC (See: #351)
    classic: {
        chainId: 61,
        name: "classic",
        _defaultProvider: etcDefaultProvider("https://www.ethercluster.com/etc", "classic")
    },

    classicMorden: {
        chainId: 62,
        name: "classicMorden",
    },

    classicMordor: classicMordor,
    classicTestnet: classicMordor,

    classicKotti: {
        chainId: 6,
        name: "classicKotti",
        _defaultProvider: etcDefaultProvider("https://www.ethercluster.com/kotti", "classicKotti")
    },
}

/**
 *  getNetwork
 *
 *  Converts a named common networks or chain ID (network ID) to a Network
 *  and verifies a network is a valid Network..
 */
export function getNetwork(network: Networkish): Network {
    // No network (null)
    if (network == null) { return null; }

    if (typeof(network) === "number") {
        for (const name in networks) {
            const standard = networks[name];
            if (standard.chainId === network) {
                return {
                    name: standard.name,
                    chainId: standard.chainId,
                    ensAddress: (standard.ensAddress || null),
                    _defaultProvider: (standard._defaultProvider || null)
                };
            }
        }

        return {
            chainId: network,
            name: "unknown"
        };
    }

    if (typeof(network) === "string") {
        const standard = networks[network];
        if (standard == null) { return null; }
        return {
            name: standard.name,
            chainId: standard.chainId,
            ensAddress: standard.ensAddress,
            _defaultProvider: (standard._defaultProvider || null)
        };
    }

    const standard  = networks[network.name];

    // Not a standard network; check that it is a valid network in general
    if (!standard) {
        if (typeof(network.chainId) !== "number") {
            logger.throwArgumentError("invalid network chainId", "network", network);
        }
        return network;
    }

    // Make sure the chainId matches the expected network chainId (or is 0; disable EIP-155)
    if (network.chainId !== 0 && network.chainId !== standard.chainId) {
        logger.throwArgumentError("network chainId mismatch", "network", network);
    }

    // @TODO: In the next major version add an attach function to a defaultProvider
    // class and move the _defaultProvider internal to this file (extend Network)
    let defaultProvider: DefaultProviderFunc = network._defaultProvider || null;
    if (defaultProvider == null && standard._defaultProvider) {
        if (isRenetworkable(standard._defaultProvider)) {
            defaultProvider = standard._defaultProvider.renetwork(network);
        } else {
            defaultProvider = standard._defaultProvider;
        }
    }

    // Standard Network (allow overriding the ENS address)
    return {
        name: network.name,
        chainId: standard.chainId,
        ensAddress: (network.ensAddress || standard.ensAddress || null),
        _defaultProvider: defaultProvider
    };
}
