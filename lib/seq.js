"use strict";
/*
 * seq.ts: A typescript wrapper for Iterable<T> providing functional programming functionality
 * similar to ReadonlyArray<T>.
 *
 * Copyright 2017 Ya'ar Hever
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 * either express or implied.
 * See the License for the specific language governing permissions and limitations
 * under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var inverse = function (func, thisArg) {
    return function () {
        var params = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            params[_i] = arguments[_i];
        }
        return !func.call.apply(func, tslib_1.__spread([thisArg], params));
    };
};
var sameValueZero = function (x, y) {
    return x === y || (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y));
};
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
                            value: value !== undefined && boundCallback(value, index++, _this)
                        };
                    }
                };
            },
            _a));
        var _a;
    };
    Seq.prototype.entries = function () {
        return this.map(function (item, index) { return [index, item]; });
    };
    Seq.prototype.keys = function () {
        return this.map(function (_, index) { return index; });
    };
    Seq.prototype.values = function () {
        return this;
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
    Seq.prototype.find = function (callback, thisArg) {
        var boundCallback = thisArg ? callback.bind(thisArg) : callback;
        try {
            for (var _a = tslib_1.__values(this.entries()), _b = _a.next(); !_b.done; _b = _a.next()) {
                var _c = tslib_1.__read(_b.value, 2), index = _c[0], item = _c[1];
                if (boundCallback(item, index, this)) {
                    return item;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_d = _a.return)) _d.call(_a);
            }
            finally { if (e_1) throw e_1.error; }
        }
        var e_1, _d;
    };
    Seq.prototype.findIndex = function (callback, thisArg) {
        var boundCallback = thisArg ? callback.bind(thisArg) : callback;
        try {
            for (var _a = tslib_1.__values(this.entries()), _b = _a.next(); !_b.done; _b = _a.next()) {
                var _c = tslib_1.__read(_b.value, 2), index = _c[0], item = _c[1];
                if (boundCallback(item, index, this)) {
                    return index;
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_d = _a.return)) _d.call(_a);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return -1;
        var e_2, _d;
    };
    Seq.prototype.every = function (callback, thisArg) {
        return this.find(inverse(callback, thisArg)) === undefined;
    };
    Seq.prototype.some = function (callback, thisArg) {
        return this.find(callback, thisArg) !== undefined;
    };
    Seq.prototype.includes = function (searchElement, fromIndex) {
        try {
            for (var _a = tslib_1.__values(this.entries()), _b = _a.next(); !_b.done; _b = _a.next()) {
                var _c = tslib_1.__read(_b.value, 2), index = _c[0], item = _c[1];
                if ((fromIndex === undefined || index >= fromIndex) &&
                    sameValueZero(item, searchElement)) {
                    return true;
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_d = _a.return)) _d.call(_a);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return false;
        var e_3, _d;
    };
    Seq.prototype.reduce = function (callbackfn, initialValue) {
        var accumulator;
        var iterator = this.entries();
        if (initialValue === undefined) {
            var _a = iterator.next(), done = _a.done, _b = tslib_1.__read(_a.value, 2), _ = _b[0], acc = _b[1];
            if (done) {
                throw new TypeError('Reduce of empty Seq with no initial value');
            }
            accumulator = acc;
        }
        else {
            accumulator = initialValue;
        }
        try {
            for (var iterator_1 = tslib_1.__values(iterator), iterator_1_1 = iterator_1.next(); !iterator_1_1.done; iterator_1_1 = iterator_1.next()) {
                var _c = tslib_1.__read(iterator_1_1.value, 2), index = _c[0], item = _c[1];
                accumulator = callbackfn(accumulator, item, index, this);
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (iterator_1_1 && !iterator_1_1.done && (_d = iterator_1.return)) _d.call(iterator_1);
            }
            finally { if (e_4) throw e_4.error; }
        }
        return accumulator;
        var e_4, _d;
    };
    Seq.prototype.join = function (separator) {
        return tslib_1.__spread(this).join(separator);
    };
    Seq.prototype.toString = function () {
        return tslib_1.__spread(this).toString();
    };
    Seq.prototype.sort = function (compareFunction) {
        return new Seq(tslib_1.__spread(this).sort(compareFunction));
    };
    Seq.prototype.reverse = function () {
        return new Seq(tslib_1.__spread(this).reverse());
    };
    Seq.of = function () {
        var values = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            values[_i] = arguments[_i];
        }
        return new Seq(values);
    };
    Seq.from = function (iterable) {
        return new Seq(iterable);
    };
    return Seq;
}());
exports.Seq = Seq;
