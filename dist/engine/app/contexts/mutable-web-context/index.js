"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useEditMutation = exports.useCreateMutation = exports.useMutationApp = exports.useMutableWeb = exports.MutableWebProvider = exports.MutableWebContext = void 0;
var mutable_web_context_1 = require("./mutable-web-context");
Object.defineProperty(exports, "MutableWebContext", { enumerable: true, get: function () { return mutable_web_context_1.MutableWebContext; } });
var mutable_web_provider_1 = require("./mutable-web-provider");
Object.defineProperty(exports, "MutableWebProvider", { enumerable: true, get: function () { return mutable_web_provider_1.MutableWebProvider; } });
var use_mutable_web_1 = require("./use-mutable-web");
Object.defineProperty(exports, "useMutableWeb", { enumerable: true, get: function () { return use_mutable_web_1.useMutableWeb; } });
var use_mutation_app_1 = require("./use-mutation-app");
Object.defineProperty(exports, "useMutationApp", { enumerable: true, get: function () { return use_mutation_app_1.useMutationApp; } });
var use_create_mutation_1 = require("./use-create-mutation");
Object.defineProperty(exports, "useCreateMutation", { enumerable: true, get: function () { return use_create_mutation_1.useCreateMutation; } });
var use_edit_mutation_1 = require("./use-edit-mutation");
Object.defineProperty(exports, "useEditMutation", { enumerable: true, get: function () { return use_edit_mutation_1.useEditMutation; } });
