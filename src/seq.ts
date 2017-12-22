export type SeqCallback<T, U> = (currentValue: T, index: number, seq: Seq<T>) => U;

export class Seq<T> implements Iterable<T> {
  constructor(private iterable: Iterable<T>) {}

  [Symbol.iterator] = this.iterable[Symbol.iterator]

  forEach (callback: SeqCallback<T, void>, thisArg?: any): void {
    const boundCallback = thisArg ? callback.bind(thisArg) : callback;
    let index = 0;

    for (const item of this.iterable) {
      boundCallback(item, index++, this)
    }
  }

  map<U> (callback: SeqCallback<T, U>, thisArg?: any): Seq<U> {
    const boundCallback: SeqCallback<T, U> = thisArg ? callback.bind(thisArg) : callback;

    return new Seq({
      [Symbol.iterator]: () => {
        const iterator = this.iterable[Symbol.iterator]();
        let index = 0;

        return {
          next: () => {
            const {done, value} = iterator.next();

            return {
              done,
              value: value && boundCallback(value, index++, this)
            } as IteratorResult<U>;
          }
        };
      }
    });
  }
}
