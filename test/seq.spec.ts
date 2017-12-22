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

  it('should be possible to spread a Seq into an array', () => {
    function* generator() {
      yield 1;
      yield 2;
      yield 3;
    }
    const seq = new Seq(generator());

    const result = [...seq];

    expect(result).to.eql([1, 2, 3]);
  });

  it('should be possible to create a Seq from an array', () => {
    const array = [1, 2, 3, 4, 5];
    const seq = new Seq(array);
    const result = [...seq];

    expect(result).to.eql(array);
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

  describe('.map()', () => {
    it('should apply the given function on each element', () => {
      const seq = new Seq([1, 2, 3, 4, 5]);
      const result = seq.map(item => item * 2);

      expect([...result]).to.be.eql([2, 4, 6, 8, 10]);
    });

    it('should call the callback for each item with the right arguments', () => {
      const seq = new Seq([1, 2, 3]);
      const spy = sinon.spy();

      // .map() is lazy, so it must be spread into an array to force it to be evaluated.
      const result = [...seq.map(spy)];

      expect(spy).to.have.been.calledWith(1, 0, seq);
      expect(spy).to.have.been.calledWith(2, 1, seq);
      expect(spy).to.have.been.calledWith(3, 2, seq);
    });
  });

  describe('Seq.of()', () => {
    it('should create a Seq out of the arguments it gets', () => {
      const seq = Seq.of(1, 2, 3, 4, 5);
      const result = [...seq];

      expect(result).to.eql([1, 2, 3, 4, 5]);
    });

    it('should create a Seq out of a single item', () => {
      const seq = Seq.of(42);
      const result = [...seq];

      expect(result).to.eql([42]);
    });

    it('should create an empty Seq', () => {
      const seq = Seq.of();
      const result = [...seq];

      expect(result).to.eql([]);
    });

    it('should create a Seq from a spread string', () => {
      const string = 'hello world';
      const seq = Seq.of(...string);
      const result = [...seq];

      expect(result).to.eql(['h', 'e', 'l', 'l', 'o', ' ', 'w', 'o', 'r', 'l', 'd']);
    });

  });
});
