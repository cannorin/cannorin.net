/** Generates a wrapper for bitset operations.
 *  Works as an efficient replacement of `Set<T>` if the universal set is known.
 */
export class BitSet<T> {
  readonly universe: readonly T[];
  readonly empty: number;
  readonly all: number;

  constructor(universe: readonly T[]) {
    this.universe = universe;
    this.empty = 0;
    this.all = 2 ** universe.length - 1;
  }

  /** Create a bitset that represents the given values.
   * The value that is not in the universe is ignored.
   */
  create(...values: readonly T[]) {
    return this.encode(new Set(values));
  }

  /** Create a bitset from the given set.
   * The value that is not in the universe is ignored.
   */
  encode(set: Set<T>): number {
    let x = 0;
    for (let i = 0; i < this.universe.length; i++) {
      if (set.has(this.universe[i] as T)) {
        x |= 1 << i;
      }
    }
    return x;
  }

  /** Create a set from the given bitset. */
  decode(x: number): Set<T> {
    if (x < this.empty || x > this.all) throw Error("invalid bits");
    const decoded = new Set<T>();
    for (let j = 0; j < this.universe.length; j++) {
      if ((x & (1 << j)) !== 0) decoded.add(this.universe[j] as T);
    }
    return decoded;
  }

  /** Returns the union of all the given bitsets. */
  union(...xs: readonly number[]): number {
    return xs.reduce((x, y) => x | y, this.empty);
  }

  /** Returns the intersection of all the given bitsets. */
  intersection(...xs: readonly number[]): number {
    return xs.reduce((x, y) => x & y, this.all);
  }

  /** Returns the bitset that is obtained from `x` by removing all the elements in `y`. */
  difference(x: number, y: number) {
    return x & (this.all - y);
  }

  /** Returns if `x` and `y` are disjoint. */
  isDisjoint(x: number, y: number): boolean {
    return (x & y) === 0;
  }

  /**
   * Returns if `x` is a subset of `y`.
   */
  isSubset(x: number, y: number): boolean {
    return (x & y) === x;
  }

  /**
   * Returns if `x` is a superset of `y`.
   */
  isSuperset(x: number, y: number): boolean {
    return (x & y) === y;
  }
}
