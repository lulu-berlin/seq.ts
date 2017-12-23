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

  describe('.filter()', () => {
    it('should keep matched items', () => {
      const seq = Seq.of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
      const result = [...seq.filter(i => i < 5)];

      expect(result).to.eql([1, 2, 3, 4]);
    });

    it('should skip unmatched items', () => {
      const seq = Seq.of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
      const result = [...seq.filter(i => i > 5)];

      expect(result).to.eql([6, 7, 8, 9, 10]);
    });

    it('should have no effect if the callback always returns true', () => {
      const seq = Seq.of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
      const result = [...seq.filter(() => true)];

      expect(result).to.eql([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    });

    it('should return an empty Seq if the callback always returns false', () => {
      const seq = Seq.of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
      const result = [...seq.filter(() => false)];

      expect(result).to.eql([]);
    });
  });

  describe('.entries()', () => {
    it('should return a new iterator with key/value pairs of index and item', () => {
      const a = ['a', 'b', 'c'];
      const seq = new Seq(a);
      const iterator = seq.entries();

      expect(iterator.next().value).to.eql([0, 'a']);
      expect(iterator.next().value).to.eql([1, 'b']);
      expect(iterator.next().value).to.eql([2, 'c']);
    });

    it('should be iterable with for...of', () => {
      const seq = new Seq(['a', 'b', 'c']);
      const iterator = seq.entries();
      const result = [];

      for (const item of iterator) {
        result.push(item);
      }

      expect(result).to.eql([
        [0, 'a'],
        [1, 'b'],
        [2, 'c']
      ]);
    });
  });

  describe('.every()', () => {
    it('should return true if the predicate is true of all items', () => {
      const seq = Seq.of(2, 4, 6, 8, 10);
      const result = seq.every(i => i % 2 === 0);
      expect(result).to.be.true;
    });

    it('should return false if the predicate is false at least once', () => {
      const seq = Seq.of(2, 4, 5, 8, 10);
      const result = seq.every(i => i % 2 === 0);
      expect(result).to.be.false;
    });
  });

  describe('.some()', () => {
    it('should return true if the predicate is true at least once', () => {
      const seq = Seq.of(2, 4, 5, 8, 10);
      const result = seq.some(i => i % 2 === 1);
      expect(result).to.be.true;
    });

    it('should return false if the predicate is false for all items', () => {
      const seq = Seq.of(2, 4, 6, 8, 10);
      const result = seq.some(i => i % 2 === 1);
      expect(result).to.be.false;
    });
  });

  describe('.find()', () => {
    it('should return the first item that matches the predicate in the callback', () => {
      const seq = Seq.of(10, 9, 8, 7, 6, 5, 4, 3, 2, 1);
      const result = seq.find(i => i < 6);
      expect(result).to.be.equal(5);
    });

    it('should return undefined if nothing was found', () => {
      const seq = Seq.of(10, 9, 8, 7, 6, 5, 4, 3, 2, 1);
      const result = seq.find(i => i > 100);
      expect(result).to.be.undefined;
    });
  });

  describe('.findIndex()', () => {
    it('should return the index of the first matching item', () => {
      const seq = Seq.of('a', 'b', 'c', 'd', 'e');
      const result = seq.findIndex(item => item === 'c');
      expect(result).to.be.equal(2);
    });

    it('should return -1 if nothing was found', () => {
      const seq = Seq.of(10, 9, 8, 7, 6, 5, 4, 3, 2, 1);
      const result = seq.findIndex(i => i > 100);
      expect(result).to.be.equal(-1);
    });
  });

  describe('.includes(searchElement[, fromIndex])', () => {
    it('should return false if the searchElement is not in the sequence', () => {
      const seq = Seq.of(1, 2, 3, 4, 5);
      const result = seq.includes(10);
      expect(result).to.be.false;
    });

    it('should return true if the searchElement is in the sequence', () => {
      const seq = Seq.of(1, 2, 3, 10, 5);
      const result = seq.includes(10);
      expect(result).to.be.true;
    });

    it('should match strings', () => {
      const seq = Seq.of('a', 'b', 'c', 'd');
      const result = seq.includes('b');
      expect(result).to.be.true;
    });

    it('should match NaN', () => {
      const seq = Seq.of(1, 2, NaN, 4);
      const result = seq.includes(NaN);
      expect(result).to.be.true;
    });

    it('should skip element until fromIndex', () => {
      const seq = Seq.of(0, 0, 0, 1, 2, 3);
      const result = seq.includes(0, 3);
      expect(result).to.be.false;
    });
  });

  describe('.join([separator])', () => {
    let seq: Seq<string>;
    beforeEach(() => {
      function* generator() {
        yield 'a';
        yield 'b';
        yield 'c';
      }
      seq = new Seq(generator());

    });

    it('should join a sequence of strings into a string with an empty separator', () => {
      expect(seq.join('')).to.eql('abc');
    });
    it('should use a comma as the default separator', () => {
      expect(seq.join()).to.eql('a,b,c');
    });
    it('should join a sequence into a string with a separator', () => {
      expect(seq.join('-')).to.eql('a-b-c');
    });
  });
});
