import {expect} from 'chai';
import {Seq} from '../src/seq';

describe('Seq', () => {
  it('should wrap an iterator and provide the same [Symbol.iterator]', () => {
    const iter: Iterable<number> = {
      [Symbol.iterator]: () => ({
        next: () => ({
          value: 1,
          done: false
        })
      })
    };

    const seq = new Seq(iter);

    expect(seq[Symbol.iterator]).to.be.equal(iter[Symbol.iterator]);
  });
});
