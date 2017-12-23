export declare type SeqCallback<T, U> = (currentValue: T, index: number, seq: Seq<T>) => U;
export declare class Seq<T> implements IterableIterator<T> {
    private iterable;
    private _iterator;
    private readonly iterator;
    constructor(iterable: Iterable<T>);
    next(): IteratorResult<T>;
    [Symbol.iterator](): this;
    forEach(callback: SeqCallback<T, void>, thisArg?: any): void;
    map<U>(callback: SeqCallback<T, U>, thisArg?: any): Seq<U>;
    filter(callback: SeqCallback<T, boolean>, thisArg?: any): Seq<T>;
    entries(): Iterator<[number, T]>;
    every(callback: SeqCallback<T, boolean>, thisArg?: any): boolean;
    some(callback: SeqCallback<T, boolean>, thisArg?: any): boolean;
    find(callback: SeqCallback<T, boolean>, thisArg?: any): T | void;
    static of<T>(...values: T[]): Seq<T>;
}
