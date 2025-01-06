export function tryOneOf<const T>(
  value: T extends LiteralUnionLike<T> ? unknown : never,
  consts: readonly T[],
) {
  if (consts.includes(value)) return value;
  return undefined;
}
