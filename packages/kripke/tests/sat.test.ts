import { expect, test } from "vitest";
import { validWorlds } from "../sat";
import { validWorlds as validWorldsNaive } from "../semantics";
import { prettyPrint } from "../syntax";
import { randomFormula, randomFrame, testFormulas } from "./utils";

const elapsed = <T>(f: () => T) => {
  const start = Date.now();
  const value = f();
  const end = Date.now();
  return { value, elapsed: end - start };
};

for (const fml of testFormulas.concat(
  [...Array(50)].map(() => randomFormula()),
)) {
  test(`SAT works for ${prettyPrint(fml)}`, () => {
    const count = 100;
    let diff = 0;
    for (let i = 0; i < count; i++) {
      const frame = randomFrame();
      const expected = elapsed(() => validWorldsNaive(frame, fml));
      const actual = elapsed(() => validWorlds(frame, fml));

      expect(actual.value.sort()).toStrictEqual(expected.value.sort());
      diff += actual.elapsed - expected.elapsed;
    }
    expect(diff / count).toBeLessThanOrEqual(10);
  });
}
