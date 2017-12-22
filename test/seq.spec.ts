import {expect} from 'chai';
import {Seq} from '../src/seq';

describe('Seq', () => {
  it('should be iterable when wrapping an iterator', () => {
    let index = 0;
    const iter: Iterable<number> = {
      [Symbol.iterator]: () => ({
        next: () => ({
          value: index++,
          done: !(index <= 3)
        })
      })
    };

    const seq = new Seq(iter);

    const results = [];

    for (const item of seq) {
      results.push(item);
    }

    expect(results).to.eql([0, 1, 2]);
  });

  it('should be iterable when wrapping a generator', () => {
    function* generator() {
      yield 1;
      yield 2;
      yield 3;
    }

    const iter = generator();
    const seq = new Seq(iter);

    const results = [];

    for (const item of seq) {
      results.push(item);
    }

    expect(results).to.eql([1, 2, 3]);
  });
});
