/** Returns a random element of the array  */
export const sample = <T>(arr: readonly T[]): T =>
  arr[Math.floor(Math.random() * arr.length)] as T;

/** Returns random N elements of the array  */
export function sampleMany<T>(arr: readonly T[], n: number = arr.length): T[] {
  if (n > arr.length) return sampleMany(arr, arr.length);
  const copy = [...arr];
  for (let i = 0; i < n; i++) {
    const j = i + Math.floor(Math.random() * (copy.length - i));
    [copy[i], copy[j]] = [copy[j] as T, copy[i] as T];
  }
  return copy.slice(0, n);
}

/** Returns a powerset of the array */
export const power = <T>(arr: readonly T[]) =>
  arr.reduce((a, v) => a.concat(a.map((r) => r.concat(v))), [[]] as T[][]);

/** Returns all the permutations of the array */
export function permutate<T>(arr: readonly T[]): T[][] {
  if (arr.length === 0) return [[]];
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i++) {
    const current = arr[i];
    const remaining = [...arr.slice(0, i), ...arr.slice(i + 1)];
    for (const perm of permutate(remaining)) {
      result.push([current as T, ...perm]);
    }
  }
  return result;
}

/** Returns the maximal elements of the array w.r.t. the preorder */
export function maximal<T>(
  arr: readonly T[],
  preorder: (x: T, y: T) => boolean,
): T[] {
  const res: T[] = [];
  outer: for (const x of arr) {
    for (let i = 0; i < res.length; ) {
      const y = res[i] as T;
      const xLeY = preorder(x, y);
      const yLeX = preorder(y, x);

      if (xLeY) {
        continue outer;
      }
      if (yLeX) {
        res.splice(i, 1);
        continue;
      }
      i++;
    }
    res.push(x);
  }
  return res;
}
