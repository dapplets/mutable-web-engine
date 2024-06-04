"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MWebPortal = exports.useMutableWeb = exports.MutableWebProvider = void 0;
var mutable_web_context_1 = require("./contexts/mutable-web-context");
Object.defineProperty(exports, "MutableWebProvider", { enumerable: true, get: function () { return mutable_web_context_1.MutableWebProvider; } });
Object.defineProperty(exports, "useMutableWeb", { enumerable: true, get: function () { return mutable_web_context_1.useMutableWeb; } });
var mweb_portal_1 = require("./components/mweb-portal");
Object.defineProperty(exports, "MWebPortal", { enumerable: true, get: function () { return mweb_portal_1.MWebPortal; } });
