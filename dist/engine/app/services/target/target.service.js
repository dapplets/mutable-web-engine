"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TargetService = void 0;
class TargetService {
    static isTargetMet(target, context) {
        // ToDo: check insertion points?
        return (target.namespace === context.namespace &&
            target.contextType === context.contextType &&
            this._areConditionsMet(target.if, context.parsedContext) &&
            (target.parent
                ? context.parentNode
                    ? this.isTargetMet(target.parent, context.parentNode)
                    : false
                : true));
    }
    static _areConditionsMet(conditions, values) {
        for (const property in conditions) {
            if (!this._isConditionMet(conditions[property], values[property])) {
                return false;
            }
        }
        return true;
    }
    static _isConditionMet(condition, value) {
        const { not: _not, eq: _eq, contains: _contains, in: _in, endsWith: _endsWith } = condition;
        if (_not !== undefined) {
            return _not !== value;
        }
        if (_eq !== undefined) {
            return _eq === value;
        }
        if (_contains !== undefined && typeof value === 'string') {
            return value.includes(_contains);
        }
        if (_endsWith !== undefined && typeof value === 'string') {
            return value.endsWith(_endsWith);
        }
        if (_in !== undefined) {
            return _in.includes(value);
        }
        return false;
    }
}
exports.TargetService = TargetService;
