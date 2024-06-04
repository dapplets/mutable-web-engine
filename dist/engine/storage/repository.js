"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Repository = void 0;
const KEY_DELIMITER = ':';
const FAVORITE_MUTATION = 'favorite-mutation';
const MUTATION_LAST_USAGE = 'mutation-last-usage';
const STOPPED_APPS = 'stopped-apps';
class Repository {
    constructor(jsonStorage) {
        this.jsonStorage = jsonStorage;
    }
    getFavoriteMutation() {
        return __awaiter(this, void 0, void 0, function* () {
            const key = this._makeKey(FAVORITE_MUTATION, window.location.hostname);
            return this._get(key);
        });
    }
    setFavoriteMutation(mutationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = this._makeKey(FAVORITE_MUTATION, window.location.hostname);
            return this._set(key, mutationId);
        });
    }
    getMutationLastUsage(mutationId, hostname) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const key = this._makeKey(MUTATION_LAST_USAGE, mutationId, hostname);
            return (_a = (yield this._get(key))) !== null && _a !== void 0 ? _a : null;
        });
    }
    setMutationLastUsage(mutationId, value, hostname) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = this._makeKey(MUTATION_LAST_USAGE, mutationId, hostname);
            return this._set(key, value);
        });
    }
    getAppEnabledStatus(mutationId, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const key = this._makeKey(STOPPED_APPS, mutationId, appId);
            return (_a = (yield this._get(key))) !== null && _a !== void 0 ? _a : true; // app is active by default
        });
    }
    setAppEnabledStatus(mutationId, appId, isEnabled) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = this._makeKey(STOPPED_APPS, mutationId, appId);
            return this._set(key, isEnabled);
        });
    }
    _get(key_1) {
        return __awaiter(this, arguments, void 0, function* (key, defaultValue = null) {
            const value = yield this.jsonStorage.getItem(key);
            return value === null ? defaultValue : value;
        });
    }
    _set(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.jsonStorage.setItem(key, value);
        });
    }
    _makeKey(...keys) {
        return keys.join(KEY_DELIMITER);
    }
}
exports.Repository = Repository;