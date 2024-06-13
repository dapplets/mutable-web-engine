"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextPortal = exports.useCore = exports.CoreProvider = void 0;
var core_context_1 = require("./contexts/core-context");
Object.defineProperty(exports, "CoreProvider", { enumerable: true, get: function () { return core_context_1.CoreProvider; } });
Object.defineProperty(exports, "useCore", { enumerable: true, get: function () { return core_context_1.useCore; } });
var context_portal_1 = require("./components/context-portal");
Object.defineProperty(exports, "ContextPortal", { enumerable: true, get: function () { return context_portal_1.ContextPortal; } });
