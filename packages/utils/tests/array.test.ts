import { describe, expect, it } from "vitest";
import { maximal, permutate, power, sample, sampleMany } from "../src/array";

describe("array utilities", () => {
  describe("sample", () => {
    it("should return an element from the array", () => {
      const arr = [1, 2, 3, 4, 5];
      const result = sample(arr);
      expect(arr).toContain(result);
    });

    it("should work with single element array", () => {
      const arr = [42];
      expect(sample(arr)).toBe(42);
    });

    it("should work with different types", () => {
      const strArr = ["a", "b", "c"];
      const result = sample(strArr);
      expect(strArr).toContain(result);
    });
  });

  describe("sampleMany", () => {
    it("should return n random elements", () => {
      const arr = [1, 2, 3, 4, 5];
      const result = sampleMany(arr, 3);
      expect(result).toHaveLength(3);
      for (const item of result) {
        expect(arr).toContain(item);
      }
    });

    it("should return all elements when n equals array length", () => {
      const arr = [1, 2, 3];
      const result = sampleMany(arr, 3);
      expect(result).toHaveLength(3);
      expect(result.sort()).toEqual(arr.sort());
    });

    it("should return all elements when n is greater than array length", () => {
      const arr = [1, 2, 3];
      const result = sampleMany(arr, 5);
      expect(result).toHaveLength(3);
      expect(result.sort()).toEqual(arr.sort());
    });

    it("should return all elements when n is not provided", () => {
      const arr = [1, 2, 3, 4];
      const result = sampleMany(arr);
      expect(result).toHaveLength(4);
      expect(result.sort()).toEqual(arr.sort());
    });

    it("should return empty array for empty input", () => {
      const arr: number[] = [];
      const result = sampleMany(arr, 3);
      expect(result).toEqual([]);
    });

    it("should not return duplicate elements", () => {
      const arr = [1, 2, 3, 4, 5];
      const result = sampleMany(arr, 5);
      const uniqueSet = new Set(result);
      expect(uniqueSet.size).toBe(result.length);
    });
  });

  describe("power", () => {
    it("should return powerset of array", () => {
      const arr = [1, 2];
      const result = power(arr);
      expect(result).toHaveLength(4);
      expect(result).toContainEqual([]);
      expect(result).toContainEqual([1]);
      expect(result).toContainEqual([2]);
      expect(result).toContainEqual([1, 2]);
    });

    it("should return [[]] for empty array", () => {
      const arr: number[] = [];
      const result = power(arr);
      expect(result).toEqual([[]]);
    });

    it("should handle three elements", () => {
      const arr = [1, 2, 3];
      const result = power(arr);
      expect(result).toHaveLength(8);
      expect(result).toContainEqual([]);
      expect(result).toContainEqual([1]);
      expect(result).toContainEqual([2]);
      expect(result).toContainEqual([3]);
      expect(result).toContainEqual([1, 2]);
      expect(result).toContainEqual([1, 3]);
      expect(result).toContainEqual([2, 3]);
      expect(result).toContainEqual([1, 2, 3]);
    });

    it("should work with strings", () => {
      const arr = ["a", "b"];
      const result = power(arr);
      expect(result).toHaveLength(4);
      expect(result).toContainEqual([]);
      expect(result).toContainEqual(["a"]);
      expect(result).toContainEqual(["b"]);
      expect(result).toContainEqual(["a", "b"]);
    });
  });

  describe("permutate", () => {
    it("should return all permutations of array", () => {
      const arr = [1, 2];
      const result = permutate(arr);
      expect(result).toHaveLength(2);
      expect(result).toContainEqual([1, 2]);
      expect(result).toContainEqual([2, 1]);
    });

    it("should return [[]] for empty array", () => {
      const arr: number[] = [];
      const result = permutate(arr);
      expect(result).toEqual([[]]);
    });

    it("should handle single element", () => {
      const arr = [1];
      const result = permutate(arr);
      expect(result).toEqual([[1]]);
    });

    it("should handle three elements", () => {
      const arr = [1, 2, 3];
      const result = permutate(arr);
      expect(result).toHaveLength(6);
      expect(result).toContainEqual([1, 2, 3]);
      expect(result).toContainEqual([1, 3, 2]);
      expect(result).toContainEqual([2, 1, 3]);
      expect(result).toContainEqual([2, 3, 1]);
      expect(result).toContainEqual([3, 1, 2]);
      expect(result).toContainEqual([3, 2, 1]);
    });

    it("should work with strings", () => {
      const arr = ["a", "b", "c"];
      const result = permutate(arr);
      expect(result).toHaveLength(6);
      // Check that all permutations are unique
      const stringified = result.map((p) => p.join(""));
      const unique = new Set(stringified);
      expect(unique.size).toBe(6);
    });
  });

  describe("maximal", () => {
    it("should return maximal elements with simple less-than preorder", () => {
      const arr = [1, 2, 3, 2, 1];
      const result = maximal(arr, (x, y) => x <= y);
      expect(result).toEqual([3]);
    });

    it("should handle incomparable elements", () => {
      // Divisibility preorder: x <= y if x divides y
      const arr = [2, 3, 4, 6, 8, 9];
      const divides = (x: number, y: number) => y % x === 0;
      const result = maximal(arr, divides);
      // 8 and 9 are maximal (nothing in the array is divisible by them except themselves)
      expect(result.sort()).toEqual([6, 8, 9]);
    });

    it("should return all elements when all are incomparable", () => {
      const arr = [1, 2, 3];
      // Always false preorder means all elements are incomparable
      const result = maximal(arr, () => false);
      expect(result.sort()).toEqual([1, 2, 3]);
    });

    it("should handle empty array", () => {
      const arr: number[] = [];
      const result = maximal(arr, (x, y) => x <= y);
      expect(result).toEqual([]);
    });

    it("should handle single element", () => {
      const arr = [42];
      const result = maximal(arr, (x, y) => x <= y);
      expect(result).toEqual([42]);
    });

    it("should handle subset preorder", () => {
      // Subset preorder on sets represented as arrays
      const arr = [[1], [2], [1, 2], [2, 3], [1, 2, 3]];
      const isSubset = (x: number[], y: number[]) =>
        x.every((elem) => y.includes(elem));
      const result = maximal(arr, isSubset);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual([1, 2, 3]);
    });

    it("should remove duplicate maximal elements", () => {
      const arr = [3, 1, 2, 3, 2];
      const result = maximal(arr, (x, y) => x <= y);
      expect(result).toEqual([3]);
    });

    it("should preserve order of maximal elements", () => {
      // Divisibility preorder: x <= y if x divides y
      const arr = [2, 6, 4, 3, 9, 8];
      const divides = (x: number, y: number) => y % x === 0;
      const result = maximal(arr, divides);
      // Check that the maximal elements appear in the same order as in the original array
      expect(result).toEqual([6, 9, 8]);
    });
  });
});
