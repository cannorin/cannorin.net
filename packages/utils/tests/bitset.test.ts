import { describe, expect, it } from "vitest";
import { BitSet } from "../src/bitset";

describe("BitSet", () => {
  // Test with string universe
  const stringUniverse = ["a", "b", "c", "d", "e"];
  const stringBitSet = new BitSet<string>(stringUniverse);

  // Test with number universe
  const numberUniverse = [1, 2, 3, 4, 5, 6, 7, 8];
  const numberBitSet = new BitSet<number>(numberUniverse);

  describe("constructor", () => {
    it("should initialize with correct universe", () => {
      expect(stringBitSet.universe).toEqual(stringUniverse);
      expect(numberBitSet.universe).toEqual(numberUniverse);
    });

    it("should calculate empty as 0", () => {
      expect(stringBitSet.empty).toBe(0);
      expect(numberBitSet.empty).toBe(0);
    });

    it("should calculate all correctly", () => {
      expect(stringBitSet.all).toBe(0b11111); // 2^5 - 1 = 31
      expect(numberBitSet.all).toBe(0b11111111); // 2^8 - 1 = 255
    });
  });

  describe("create", () => {
    it("should create empty bitset when no values provided", () => {
      const bitset = stringBitSet.create();
      expect(bitset).toBe(0);
    });

    it("should create bitset from single value", () => {
      const bitset = stringBitSet.create("a");
      const reference = new Set(["a"]);
      expect(stringBitSet.decode(bitset)).toEqual(reference);
    });

    it("should create bitset from multiple values", () => {
      const bitset = stringBitSet.create("a", "c", "e");
      const reference = new Set(["a", "c", "e"]);
      expect(stringBitSet.decode(bitset)).toEqual(reference);
    });

    it("should ignore values not in universe", () => {
      const bitset = stringBitSet.create("a", "z", "b", "x");
      const reference = new Set(["a", "b"]);
      expect(stringBitSet.decode(bitset)).toEqual(reference);
    });

    it("should handle duplicate values", () => {
      const bitset = stringBitSet.create("a", "a", "b", "b");
      const reference = new Set(["a", "b"]);
      expect(stringBitSet.decode(bitset)).toEqual(reference);
    });
  });

  describe("encode", () => {
    it("should encode empty set to 0", () => {
      const set = new Set<string>();
      expect(stringBitSet.encode(set)).toBe(0);
    });

    it("should encode full set correctly", () => {
      const set = new Set(stringUniverse);
      expect(stringBitSet.encode(set)).toBe(stringBitSet.all);
    });

    it("should encode subset correctly", () => {
      const set = new Set(["b", "d"]);
      const bitset = stringBitSet.encode(set);
      expect(stringBitSet.decode(bitset)).toEqual(set);
    });

    it("should ignore elements not in universe", () => {
      const set = new Set(["a", "x", "y", "c"]);
      const bitset = stringBitSet.encode(set);
      const expected = new Set(["a", "c"]);
      expect(stringBitSet.decode(bitset)).toEqual(expected);
    });
  });

  describe("decode", () => {
    it("should decode 0 to empty set", () => {
      expect(stringBitSet.decode(0)).toEqual(new Set());
    });

    it("should decode all bits to full set", () => {
      expect(stringBitSet.decode(stringBitSet.all)).toEqual(
        new Set(stringUniverse),
      );
    });

    it("should decode specific bits correctly", () => {
      // bits: 10101 = positions 0, 2, 4 = 'a', 'c', 'e'
      const bitset = 0b10101;
      expect(stringBitSet.decode(bitset)).toEqual(new Set(["a", "c", "e"]));
    });

    it("should throw error for invalid bits (negative)", () => {
      expect(() => stringBitSet.decode(-1)).toThrow("invalid bits");
    });

    it("should throw error for invalid bits (too large)", () => {
      expect(() => stringBitSet.decode(stringBitSet.all + 1)).toThrow(
        "invalid bits",
      );
    });
  });

  describe("union", () => {
    it("should return empty for no arguments", () => {
      expect(stringBitSet.union()).toBe(0);
    });

    it("should return same value for single argument", () => {
      const bitset = stringBitSet.create("a", "b");
      expect(stringBitSet.union(bitset)).toBe(bitset);
    });

    it("should compute union correctly", () => {
      const set1 = new Set(["a", "b"]);
      const set2 = new Set(["b", "c"]);
      const set3 = new Set(["d"]);

      const bitset1 = stringBitSet.encode(set1);
      const bitset2 = stringBitSet.encode(set2);
      const bitset3 = stringBitSet.encode(set3);

      const unionBitset = stringBitSet.union(bitset1, bitset2, bitset3);
      const unionSet = stringBitSet.decode(unionBitset);

      // Reference using standard Set
      const referenceUnion = new Set([...set1, ...set2, ...set3]);
      expect(unionSet).toEqual(referenceUnion);
    });

    it("should handle union with empty sets", () => {
      const bitset1 = stringBitSet.create("a", "b");
      const empty = stringBitSet.empty;

      expect(stringBitSet.union(bitset1, empty)).toBe(bitset1);
      expect(stringBitSet.union(empty, bitset1)).toBe(bitset1);
    });
  });

  describe("intersection", () => {
    it("should return all bits for no arguments", () => {
      // This is because reduce with no initial value uses first element
      expect(stringBitSet.intersection()).toBe(stringBitSet.all);
    });

    it("should return same value for single argument", () => {
      const bitset = stringBitSet.create("a", "b");
      expect(stringBitSet.intersection(bitset)).toBe(bitset);
    });

    it("should compute intersection correctly", () => {
      const set1 = new Set(["a", "b", "c"]);
      const set2 = new Set(["b", "c", "d"]);
      const set3 = new Set(["c", "d", "e"]);

      const bitset1 = stringBitSet.encode(set1);
      const bitset2 = stringBitSet.encode(set2);
      const bitset3 = stringBitSet.encode(set3);

      const intersectionBitset = stringBitSet.intersection(
        bitset1,
        bitset2,
        bitset3,
      );
      const intersectionSet = stringBitSet.decode(intersectionBitset);

      // Reference using standard Set
      const referenceIntersection = new Set(
        [...set1].filter((x) => set2.has(x) && set3.has(x)),
      );
      expect(intersectionSet).toEqual(referenceIntersection);
    });

    it("should handle intersection with empty set", () => {
      const bitset1 = stringBitSet.create("a", "b");
      const empty = stringBitSet.empty;

      expect(stringBitSet.intersection(bitset1, empty)).toBe(empty);
      expect(stringBitSet.intersection(empty, bitset1)).toBe(empty);
    });

    it("should handle disjoint sets", () => {
      const bitset1 = stringBitSet.create("a", "b");
      const bitset2 = stringBitSet.create("c", "d");

      expect(stringBitSet.intersection(bitset1, bitset2)).toBe(0);
    });
  });

  describe("difference", () => {
    it("should compute difference correctly", () => {
      const set1 = new Set(["a", "b", "c", "d"]);
      const set2 = new Set(["b", "d"]);

      const bitset1 = stringBitSet.encode(set1);
      const bitset2 = stringBitSet.encode(set2);

      const differenceBitset = stringBitSet.difference(bitset1, bitset2);
      const differenceSet = stringBitSet.decode(differenceBitset);

      // Reference using standard Set
      const referenceDifference = new Set(
        [...set1].filter((x) => !set2.has(x)),
      );
      expect(differenceSet).toEqual(referenceDifference);
    });

    it("should return empty when subtracting from empty", () => {
      const bitset = stringBitSet.create("a", "b");
      expect(stringBitSet.difference(stringBitSet.empty, bitset)).toBe(0);
    });

    it("should return original when subtracting empty", () => {
      const bitset = stringBitSet.create("a", "b");
      expect(stringBitSet.difference(bitset, stringBitSet.empty)).toBe(bitset);
    });

    it("should return empty when subtracting self", () => {
      const bitset = stringBitSet.create("a", "b", "c");
      expect(stringBitSet.difference(bitset, bitset)).toBe(0);
    });
  });

  describe("isDisjoint", () => {
    it("should return true for disjoint sets", () => {
      const set1 = new Set(["a", "b"]);
      const set2 = new Set(["c", "d"]);

      const bitset1 = stringBitSet.encode(set1);
      const bitset2 = stringBitSet.encode(set2);

      expect(stringBitSet.isDisjoint(bitset1, bitset2)).toBe(true);
    });

    it("should return false for overlapping sets", () => {
      const set1 = new Set(["a", "b", "c"]);
      const set2 = new Set(["c", "d", "e"]);

      const bitset1 = stringBitSet.encode(set1);
      const bitset2 = stringBitSet.encode(set2);

      expect(stringBitSet.isDisjoint(bitset1, bitset2)).toBe(false);
    });

    it("should return true when one or both sets are empty", () => {
      const bitset = stringBitSet.create("a", "b");
      const empty = stringBitSet.empty;

      expect(stringBitSet.isDisjoint(empty, empty)).toBe(true);
      expect(stringBitSet.isDisjoint(bitset, empty)).toBe(true);
      expect(stringBitSet.isDisjoint(empty, bitset)).toBe(true);
    });
  });

  describe("isSubset", () => {
    it("should return true for subset", () => {
      const set1 = new Set(["a", "b"]);
      const set2 = new Set(["a", "b", "c", "d"]);

      const bitset1 = stringBitSet.encode(set1);
      const bitset2 = stringBitSet.encode(set2);

      expect(stringBitSet.isSubset(bitset1, bitset2)).toBe(true);
    });

    it("should return false for non-subset", () => {
      const set1 = new Set(["a", "b", "e"]);
      const set2 = new Set(["a", "b", "c", "d"]);

      const bitset1 = stringBitSet.encode(set1);
      const bitset2 = stringBitSet.encode(set2);

      expect(stringBitSet.isSubset(bitset1, bitset2)).toBe(false);
    });

    it("should return true for equal sets", () => {
      const bitset = stringBitSet.create("a", "b", "c");
      expect(stringBitSet.isSubset(bitset, bitset)).toBe(true);
    });

    it("should handle empty set as subset", () => {
      const bitset = stringBitSet.create("a", "b");
      const empty = stringBitSet.empty;

      expect(stringBitSet.isSubset(empty, bitset)).toBe(true);
      expect(stringBitSet.isSubset(empty, empty)).toBe(true);
      expect(stringBitSet.isSubset(bitset, empty)).toBe(false);
    });
  });

  describe("isSuperset", () => {
    it("should return true for superset", () => {
      const set1 = new Set(["a", "b", "c", "d"]);
      const set2 = new Set(["a", "b"]);

      const bitset1 = stringBitSet.encode(set1);
      const bitset2 = stringBitSet.encode(set2);

      expect(stringBitSet.isSuperset(bitset1, bitset2)).toBe(true);
    });

    it("should return false for non-superset", () => {
      const set1 = new Set(["a", "b", "c"]);
      const set2 = new Set(["a", "b", "d"]);

      const bitset1 = stringBitSet.encode(set1);
      const bitset2 = stringBitSet.encode(set2);

      expect(stringBitSet.isSuperset(bitset1, bitset2)).toBe(false);
    });

    it("should return true for equal sets", () => {
      const bitset = stringBitSet.create("a", "b", "c");
      expect(stringBitSet.isSuperset(bitset, bitset)).toBe(true);
    });

    it("should handle empty set", () => {
      const bitset = stringBitSet.create("a", "b");
      const empty = stringBitSet.empty;

      expect(stringBitSet.isSuperset(bitset, empty)).toBe(true);
      expect(stringBitSet.isSuperset(empty, empty)).toBe(true);
      expect(stringBitSet.isSuperset(empty, bitset)).toBe(false);
    });
  });

  describe("edge cases and performance", () => {
    it("should handle large universe efficiently", () => {
      const largeUniverse = Array.from({ length: 30 }, (_, i) => i);
      const largeBitSet = new BitSet(largeUniverse);

      expect(largeBitSet.all).toBe(2 ** 30 - 1);

      const set = new Set([0, 5, 10, 15, 20, 25, 29]);
      const bitset = largeBitSet.encode(set);
      expect(largeBitSet.decode(bitset)).toEqual(set);
    });

    it("should maintain consistency across operations", () => {
      const a = stringBitSet.create("a", "b");
      const b = stringBitSet.create("b", "c");
      const c = stringBitSet.create("c", "d");

      // (A ∪ B) ∩ C = (A ∩ C) ∪ (B ∩ C)
      const left = stringBitSet.intersection(stringBitSet.union(a, b), c);
      const right = stringBitSet.union(
        stringBitSet.intersection(a, c),
        stringBitSet.intersection(b, c),
      );
      expect(left).toBe(right);

      // A - (B ∪ C) = (A - B) ∩ (A - C)
      const left2 = stringBitSet.difference(a, stringBitSet.union(b, c));
      const right2 = stringBitSet.intersection(
        stringBitSet.difference(a, b),
        stringBitSet.difference(a, c),
      );
      expect(left2).toBe(right2);
    });
  });
});
