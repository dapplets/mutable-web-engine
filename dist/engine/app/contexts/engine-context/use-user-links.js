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
exports.useUserLinks = void 0;
const react_1 = require("react");
const use_engine_1 = require("./use-engine");
const useUserLinks = (context) => {
    const { engine } = (0, use_engine_1.useEngine)();
    const [userLinks, setUserLinks] = (0, react_1.useState)([]);
    const [error, setError] = (0, react_1.useState)(null);
    const fetchUserLinks = (0, react_1.useCallback)(() => __awaiter(void 0, void 0, void 0, function* () {
        if (!engine)
            return;
        try {
            const links = yield engine.mutationManager.getLinksForContext(context);
            setUserLinks(links);
        }
        catch (err) {
            if (err instanceof Error) {
                setError(err);
            }
            else {
                setError(new Error('An unknown error occurred'));
            }
        }
    }), [engine, context]);
    (0, react_1.useEffect)(() => {
        fetchUserLinks();
    }, [fetchUserLinks]);
    return { userLinks, error };
};
exports.useUserLinks = useUserLinks;
