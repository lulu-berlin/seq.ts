"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
