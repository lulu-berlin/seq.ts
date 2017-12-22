import {expect, use} from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
use(sinonChai);

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

  describe('.forEach()', () => {
    let iterator: IterableIterator<number>;

    beforeEach(() => {
      function* generator() {
        yield 1;
        yield 2;
        yield 3;
      }

      iterator = generator();
    });

    it('should call the callback for each item', () => {
      const seq = new Seq(iterator);
      const spy = sinon.spy();

      seq.forEach(spy);

      expect(spy).to.have.callCount(3);
    });

    it('should call the callback for each item with the right arguments', () => {
      const seq = new Seq(iterator);
      const spy = sinon.spy();

      seq.forEach(spy);

      expect(spy).to.have.been.calledWith(1, 0, seq);
      expect(spy).to.have.been.calledWith(2, 1, seq);
      expect(spy).to.have.been.calledWith(3, 2, seq);
    });

    it('should call the callback in the right order', () => {
      const seq = new Seq(iterator);
      const result: number[] = [];
      seq.forEach(item => result.push(item));
      expect(result).to.eql([1,2,3]);
    });
  });
});
