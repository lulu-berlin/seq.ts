"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Seq = /** @class */ (function () {
    function Seq(iterable) {
        this.iterable = iterable;
        this._iterator = null;
    }
    Object.defineProperty(Seq.prototype, "iterator", {
        get: function () {
            if (!this._iterator) {
                this._iterator = this.iterable[Symbol.iterator]();
            }
            return this._iterator;
        },
        enumerable: true,
        configurable: true
    });
    Seq.prototype.next = function () {
        return this.iterator.next();
    };
    Seq.prototype[Symbol.iterator] = function () {
        return this;
    };
    ;
    Seq.prototype.forEach = function (callback, thisArg) {
        var boundCallback = thisArg ? callback.bind(thisArg) : callback;
        for (var item = this.iterator.next(), index = 0; !item.done; item = this.iterator.next()) {
            boundCallback(item.value, index++, this);
        }
    };
    Seq.prototype.map = function (callback, thisArg) {
        var _this = this;
        var boundCallback = thisArg ? callback.bind(thisArg) : callback;
        return new Seq((_a = {},
            _a[Symbol.iterator] = function () {
                var index = 0;
                return {
                    next: function () {
                        var _a = _this.iterator.next(), done = _a.done, value = _a.value;
                        return {
                            done: done,
                            value: value && boundCallback(value, index++, _this)
                        };
                    }
                };
            },
            _a));
        var _a;
    };
    Seq.prototype.filter = function (callback, thisArg) {
        var _this = this;
        var boundCallback = thisArg ? callback.bind(thisArg) : callback;
        return new Seq((_a = {},
            _a[Symbol.iterator] = function () {
                var index = 0;
                return {
                    next: function () {
                        var result = _this.iterator.next();
                        while (!result.done && !boundCallback(result.value, index++, _this)) {
                            result = _this.iterator.next();
                        }
                        return result;
                    }
                };
            },
            _a));
        var _a;
    };
    Seq.prototype.entries = function () {
        return this.map(function (item, index) { return [index, item]; });
    };
    Seq.prototype.every = function (callback, thisArg) {
        var boundCallback = thisArg ? callback.bind(thisArg) : callback;
        var index = 0;
        try {
            for (var _a = tslib_1.__values(this), _b = _a.next(); !_b.done; _b = _a.next()) {
                var item = _b.value;
                if (!boundCallback(item, index++, this)) {
                    return false;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return true;
        var e_1, _c;
    };
    Seq.prototype.some = function (callback, thisArg) {
        var boundCallback = thisArg ? callback.bind(thisArg) : callback;
        var index = 0;
        try {
            for (var _a = tslib_1.__values(this), _b = _a.next(); !_b.done; _b = _a.next()) {
                var item = _b.value;
                if (boundCallback(item, index++, this)) {
                    return true;
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return false;
        var e_2, _c;
    };
    Seq.prototype.find = function (callback, thisArg) {
        var boundCallback = thisArg ? callback.bind(thisArg) : callback;
        var index = 0;
        try {
            for (var _a = tslib_1.__values(this), _b = _a.next(); !_b.done; _b = _a.next()) {
                var item = _b.value;
                if (boundCallback(item, index++, this)) {
                    return item;
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
            }
            finally { if (e_3) throw e_3.error; }
        }
        var e_3, _c;
    };
    Seq.of = function () {
        var values = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            values[_i] = arguments[_i];
        }
        return new Seq(values);
    };
    return Seq;
}());
exports.Seq = Seq;
