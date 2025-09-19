const bitIsSet = (num: number, pos: number) => (num & (1 << pos)) !== 0;

export function encode<T>(all: readonly T[], set: Set<T>): number {
  let flags = 0;
  for (let i = 0; i < all.length; i++) {
    if (set.has(all[i] as T)) {
      flags |= 1 << i;
    }
  }
  return flags;
}

export function decode<T>(all: readonly T[], flags: number): Set<T> {
  const total = 2 ** all.length;
  if (flags < 0 || flags >= total) throw Error("invalid flags");
  const decoded = new Set<T>();
  for (let j = 0; j < all.length; j++) {
    if (bitIsSet(flags, j)) decoded.add(all[j] as T);
  }
  return decoded;
}

export function* power<T>(xs: readonly T[]) {
  const total = 2 ** xs.length;
  for (let i = 0; i < total; i++) {
    yield decode(xs, i);
  }
}

export function permutations<T>(arr: readonly T[]): T[][] {
  if (arr.length === 0) return [[]];
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i++) {
    const current = arr[i];
    const remaining = [...arr.slice(0, i), ...arr.slice(i + 1)];
    for (const perm of permutations(remaining)) {
      result.push([current as T, ...perm]);
    }
  }
  return result;
}

export function maximal<T>(
  xs: readonly T[],
  preorder: (x: T, y: T) => boolean,
): T[] {
  const res: T[] = [];
  outer: for (const x of xs) {
    for (let i = 0; i < res.length; ) {
      const y = res[i] as T;
      const xLeY = preorder(x, y);
      const yLeX = preorder(y, x);

      if (xLeY && !yLeX) {
        continue outer;
      }
      if (yLeX && !xLeY) {
        res.splice(i, 1);
        continue;
      }
      i++;
    }
    res.push(x);
  }
  return res;
}
