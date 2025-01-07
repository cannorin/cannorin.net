export function tryOneOf<const T>(
  value: T extends LiteralUnionLike<T> ? unknown : never,
  consts: readonly T[],
) {
  if (consts.includes(value)) return value;
  return undefined;
}

export function sample<T>(arr: T[], n: number = arr.length): T[] {
  if (n > arr.length) return sample(arr, arr.length);
  const copy = [...arr];
  for (let i = 0; i < n; i++) {
    const j = i + Math.floor(Math.random() * (copy.length - i));
    [copy[i], copy[j]] = [copy[j] as T, copy[i] as T];
  }
  return copy.slice(0, n);
}
