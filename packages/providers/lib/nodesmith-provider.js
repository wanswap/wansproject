/* istanbul ignore file */
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var url_json_rpc_provider_1 = require("./url-json-rpc-provider");
var logger_1 = require("@wansproject/logger");
var _version_1 = require("./_version");
var logger = new logger_1.Logger(_version_1.version);
// Special API key provided by Nodesmith for ethers.js
var defaultApiKey = "ETHERS_JS_SHARED";
var NodesmithProvider = /** @class */ (function (_super) {
    __extends(NodesmithProvider, _super);
    function NodesmithProvider() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NodesmithProvider.getApiKey = function (apiKey) {
        if (apiKey && typeof (apiKey) !== "string") {
            logger.throwArgumentError("invalid apiKey", "apiKey", apiKey);
        }
        return apiKey || defaultApiKey;
    };
    NodesmithProvider.getUrl = function (network, apiKey) {
        logger.warn("NodeSmith will be discontinued on 2019-12-20; please migrate to another platform.");
        var host = null;
        switch (network.name) {
            case "homestead":
                host = "https://ethereum.api.nodesmith.io/v1/mainnet/jsonrpc";
                break;
            case "ropsten":
                host = "https://ethereum.api.nodesmith.io/v1/ropsten/jsonrpc";
                break;
            case "rinkeby":
                host = "https://ethereum.api.nodesmith.io/v1/rinkeby/jsonrpc";
                break;
            case "goerli":
                host = "https://ethereum.api.nodesmith.io/v1/goerli/jsonrpc";
                break;
            case "kovan":
                host = "https://ethereum.api.nodesmith.io/v1/kovan/jsonrpc";
                break;
            default:
                logger.throwArgumentError("unsupported network", "network", arguments[0]);
        }
        return (host + "?apiKey=" + apiKey);
    };
    return NodesmithProvider;
}(url_json_rpc_provider_1.UrlJsonRpcProvider));
exports.NodesmithProvider = NodesmithProvider;
//# sourceMappingURL=nodesmith-provider.js.map