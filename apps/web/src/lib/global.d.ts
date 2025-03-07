interface String {
  concat<S extends string>(string: S): `${this}${S}`;
  concat<S1 extends string, S2 extends string>(
    s1: S1,
    s2: S2,
  ): `${this}${S1}${S2}`;
  startsWith<S extends string>(searchString: S): this is `${S}${string}`;
  endsWith<S extends string>(searchString: S): this is `${string}${S}`;
  includes<S extends string>(
    searchString: S,
    position?: number,
  ): this is `${string}${S}${string}`;
}

type LiteralUnionLike<T> = T extends string
  ? T extends ""
    ? T
    : T extends `${T}${T}`
      ? never
      : T
  : T extends number
    ? `${T}0` extends `${number}`
      ? T
      : never
    : T extends null | undefined
      ? T
      : never;

interface Array<T> {
  includes(
    searchElement: T extends LiteralUnionLike<T> ? unknown : never,
    fromIndex?: number,
  ): searchElement is T extends LiteralUnionLike<T> ? T : never;
}

interface ReadonlyArray<T> {
  includes(
    searchElement: T extends LiteralUnionLike<T> ? unknown : never,
    fromIndex?: number,
  ): searchElement is T extends LiteralUnionLike<T> ? T : never;
}

declare module "*&enhanced" {
  import type { Picture } from "vite-imagetools";

  const value: Picture;
  export default value;
}
