"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Seq = /** @class */ (function () {
    function Seq(iterable) {
        this.iterable = iterable;
        this[Symbol.iterator] = this.iterable[Symbol.iterator];
    }
    Seq.prototype.forEach = function (callback, thisArg) {
        var boundCallback = thisArg ? callback.bind(thisArg) : callback;
        var index = 0;
        try {
            for (var _a = tslib_1.__values(this.iterable), _b = _a.next(); !_b.done; _b = _a.next()) {
                var item = _b.value;
                boundCallback(item, index++, this);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
            }
            finally { if (e_1) throw e_1.error; }
        }
        var e_1, _c;
    };
    Seq.prototype.map = function (callback, thisArg) {
        var _this = this;
        var boundCallback = thisArg ? callback.bind(thisArg) : callback;
        return new Seq((_a = {},
            _a[Symbol.iterator] = function () {
                var iterator = _this.iterable[Symbol.iterator]();
                var index = 0;
                return {
                    next: function () {
                        var _a = iterator.next(), done = _a.done, value = _a.value;
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
    return Seq;
}());
exports.Seq = Seq;
