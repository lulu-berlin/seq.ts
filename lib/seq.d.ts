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
    entries(): IterableIterator<[number, T]>;
    filter(callback: SeqCallback<T, boolean>, thisArg?: any): Seq<T>;
    find(callback: SeqCallback<T, boolean>, thisArg?: any): T | void;
    findIndex(callback: SeqCallback<T, boolean>, thisArg?: any): number;
    every(callback: SeqCallback<T, boolean>, thisArg?: any): boolean;
    some(callback: SeqCallback<T, boolean>, thisArg?: any): boolean;
    static of<T>(...values: T[]): Seq<T>;
}
