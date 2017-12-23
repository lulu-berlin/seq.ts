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

export type SeqCallback<T, U> = (currentValue: T, index: number, seq: Seq<T>) => U;

const inverse = (func: Function, thisArg: any) =>
  (...params: any[]) => !func.call(thisArg, ...params);

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

  forEach(callback: SeqCallback<T, void>, thisArg?: any): void {
    const boundCallback = thisArg ? callback.bind(thisArg) : callback;

    for (
      let item = this.iterator.next(), index = 0;
      !item.done;
      item = this.iterator.next()
    ) {
      boundCallback(item.value, index++, this);
    }
  }

  map<U>(callback: SeqCallback<T, U>, thisArg?: any): Seq<U> {
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

  entries(): IterableIterator<[number, T]> {
    return this.map((item, index) => [index, item] as [number, T]);
  }

  filter(callback: SeqCallback<T, boolean>, thisArg?: any): Seq<T> {
    const boundCallback: SeqCallback<T, boolean> = thisArg ? callback.bind(thisArg) : callback;

    return new Seq({
      [Symbol.iterator]: () => {
        let index = 0;

        return {
          next: () => {
            let result = this.iterator.next();

            while (!result.done && !boundCallback(result.value, index++, this)) {
              result = this.iterator.next();
            }

            return result;
          }
        }
      }
    });
  }

  find(callback: SeqCallback<T, boolean>, thisArg?: any): T | void {
    const boundCallback: SeqCallback<T, boolean> = thisArg ? callback.bind(thisArg) : callback;

    for (const [index, item] of this.entries()) {
      if (boundCallback(item, index, this)) {
        return item;
      }
    }
  }

  findIndex(callback: SeqCallback<T, boolean>, thisArg?: any): number {
    const boundCallback: SeqCallback<T, boolean> = thisArg ? callback.bind(thisArg) : callback;

    for (const [index, item] of this.entries()) {
      if (boundCallback(item, index, this)) {
        return index;
      }
    }

    return -1;
  }

  every(callback: SeqCallback<T, boolean>, thisArg?: any): boolean {
    return this.find(inverse(callback, thisArg)) === undefined;
  }

  some(callback: SeqCallback<T, boolean>, thisArg?: any): boolean {
    return this.find(callback, thisArg) !== undefined;
  }

  static of<T>(...values: T[]): Seq<T> {
    return new Seq(values);
  }
}
