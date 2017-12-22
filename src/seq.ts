export type SeqCallback<T, U> = (currentValue: T, index: number, seq: Seq<T>) => U;

export class Seq<T> implements IterableIterator<T> {
  private _iterator: Iterator<T> | null = null;

  private get iterator(): Iterator<T> {
    if (!this._iterator) {
      this._iterator = this.iterable[Symbol.iterator]();
    }
    return this._iterator;
  }

  constructor(private iterable: Iterable<T>) {
  }

  public next(): IteratorResult<T> {
    return this.iterator.next();
  }

  [Symbol.iterator]() {
    return this;
  };

  forEach (callback: SeqCallback<T, void>, thisArg?: any): void {
    const boundCallback = thisArg ? callback.bind(thisArg) : callback;

    let item = this.iterator.next();
    let index = 0;

    while (!item.done) {
      boundCallback(item, index++, this);
    }
  }

  map<U> (callback: SeqCallback<T, U>, thisArg?: any): Seq<U> {
    const boundCallback: SeqCallback<T, U> = thisArg ? callback.bind(thisArg) : callback;

    return new Seq({
      [Symbol.iterator]: () => {
        let index = 0;

        return {
          next: () => {
            const {done, value} = this.iterator.next();

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
