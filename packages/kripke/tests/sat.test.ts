import { power } from "@cannorin/utils";
import { expect, test } from "vitest";
import { validWorlds } from "../src/sat";
import { type Frame, satisfy, type World, worlds } from "../src/semantics";
import {
  type Formula,
  type PropVar,
  prettyPrint,
  propVars,
  vars,
} from "../src/syntax";
import { randomFormula, randomFrame, testFormulas } from "./utils";

const elapsed = <T>(f: () => T) => {
  const start = Date.now();
  const value = f();
  const end = Date.now();
  return { value, elapsed: end - start };
};

export function validWorldsNaive(
  f: Frame,
  fml: Formula,
  allValuations: `${World}${PropVar}`[][],
) {
  const result: World[] = [];
  for (const w of worlds) {
    let valid = true;
    for (const v of allValuations) {
      if (!satisfy({ ...f, valuations: new Set(v) }, w, fml)) {
        valid = false;
        break;
      }
    }
    if (valid) result.push(w);
  }
  return result;
}

for (const fml of testFormulas.concat(
  [...Array(100)].map(() => randomFormula()),
)) {
  test(`SAT works for ${prettyPrint(fml)}`, () => {
    const count = 100;
    let diff = 0;
    const allValuations = power(
      worlds.flatMap((w) =>
        (fml ? Array.from(vars(fml)) : propVars).map(
          (p) => `${w}${p}` as const,
        ),
      ),
    );
    for (let i = 0; i < count; i++) {
      const frame = randomFrame();
      const expected = elapsed(() =>
        validWorldsNaive(frame, fml, allValuations),
      );
      const actual = elapsed(() => validWorlds(frame, fml));

      expect(actual.value.sort()).toStrictEqual(expected.value.sort());
      diff += actual.elapsed - expected.elapsed;
    }
    expect(diff / count).toBeLessThanOrEqual(10);
  });
}
