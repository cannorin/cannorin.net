export const sample = <T>(arr: readonly T[]): T =>
  arr[Math.floor(Math.random() * arr.length)] as T;

export function sampleMany<T>(arr: T[], n: number = arr.length): T[] {
  if (n > arr.length) return sampleMany(arr, arr.length);
  const copy = [...arr];
  for (let i = 0; i < n; i++) {
    const j = i + Math.floor(Math.random() * (copy.length - i));
    [copy[i], copy[j]] = [copy[j] as T, copy[i] as T];
  }
  return copy.slice(0, n);
}
