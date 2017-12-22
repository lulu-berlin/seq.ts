export declare type SeqCallback<T, U> = (currentValue: T, index: number, seq: Seq<T>) => U;
export declare class Seq<T> implements Iterable<T> {
    private iterable;
    constructor(iterable: Iterable<T>);
    [Symbol.iterator]: () => Iterator<T>;
    forEach(callback: SeqCallback<T, void>, thisArg?: any): void;
    map<U>(callback: SeqCallback<T, U>, thisArg?: any): Seq<U>;
}
