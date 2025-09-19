import type {} from "@cannorin/utils/headless";
import { type Frame, type World, left, right, worlds } from "./semantics";
import {
  type Formula,
  type NNFFormula,
  type PropVar,
  not,
  simplify,
  tagNNF,
  toNNF,
} from "./syntax";
import { maximal } from "./utils";

export type Constraints =
  | true
  | ReadonlySet<`${World}${PropVar}` | `!${World}${PropVar}`>;

export type Context = {
  notFml: NNFFormula<number>;
  next: Record<World, World[]>;
  memo: Map<`${World}:${number}`, Constraints[]>;
  constant: Map<`${World}:${number}`, boolean>;
};

export function buildContext(frame: Frame, fml: Formula): Context {
  let index = 0;
  const notFml = tagNNF(toNNF(simplify(not(fml))), () => {
    index++;
    return index;
  });

  const next: Record<World, World[]> = { a: [], b: [], c: [], d: [] };
  for (const rel of frame.relations.values()) {
    const u = left(rel);
    const v = right(rel);
    next[u].push(v);
  }

  const constant: Map<`${World}:${number}`, boolean> = new Map();
  function addConstants(f: NNFFormula<number>) {
    switch (f.type) {
      case "top": {
        for (const w of worlds) constant.set(`${w}:${f.tag}`, true);
        return;
      }
      case "bot": {
        for (const w of worlds) constant.set(`${w}:${f.tag}`, false);
        return;
      }
      case "propvar":
      case "not":
        return;
      case "box": {
        addConstants(f.fml);
        for (const w1 of worlds) {
          const xs = next[w1].map((w2) => constant.get(`${w2}:${f.fml.tag}`));
          if (xs.some((x) => x === undefined)) continue;
          constant.set(
            `${w1}:${f.tag}`,
            xs.every((x) => x === true),
          );
        }
        return;
      }
      case "diamond": {
        addConstants(f.fml);
        for (const w1 of worlds) {
          const xs = next[w1].map((w2) => constant.get(`${w2}:${f.fml.tag}`));
          if (xs.some((x) => x === undefined)) continue;
          constant.set(
            `${w1}:${f.tag}`,
            xs.some((x) => x === true),
          );
        }
        return;
      }
      case "or": {
        addConstants(f.left);
        addConstants(f.right);
        for (const w of worlds) {
          const l = constant.get(`${w}:${f.left.tag}`);
          const r = constant.get(`${w}:${f.right.tag}`);
          if (l === undefined || r === undefined) continue;
          constant.set(`${w}:${f.tag}`, l || r);
        }
        return;
      }
      case "and": {
        addConstants(f.left);
        addConstants(f.right);
        for (const w of worlds) {
          const l = constant.get(`${w}:${f.left.tag}`);
          const r = constant.get(`${w}:${f.right.tag}`);
          if (l === undefined || r === undefined) continue;
          constant.set(`${w}:${f.tag}`, l && r);
        }
        return;
      }
    }
  }
  addConstants(notFml);

  return { notFml, next, memo: new Map(), constant };
}

const subsumes = (c1: Constraints, c2: Constraints): boolean => {
  if (c1 === true) return c2 === true;
  if (c2 === true) return true;
  for (const v of c2.values()) {
    if (!c1.has(v)) return false;
  }
  return true;
};

const union = (c1: Constraints, c2: Constraints): Constraints => {
  if (c1 === true) return c2;
  if (c2 === true) return c1;
  return new Set([...c1.values(), ...c2.values()]);
};

const consistent = (c: Constraints) => {
  if (c === true) return true;
  for (const v of c.values()) {
    if (!v.startsWith("!") && c.has(`!${v}`)) return false;
  }
  return true;
};

export function sat(
  frame: Frame,
  fml: NNFFormula<number>,
  world: World,
  ctx: Context = buildContext(frame, fml),
): Constraints[] {
  const key = `${world}:${fml.tag}` as const;
  const c = ctx.constant.get(key);
  if (c === true) return [true];
  if (c === false) return [];

  let result = ctx.memo.get(key);
  if (result) return result;

  switch (fml.type) {
    case "top":
      result = [true];
      break;
    case "bot":
      result = [];
      break;
    case "propvar":
      result = [new Set([`${world}${fml.name}` as const])];
      break;
    case "not":
      result = [new Set([`!${world}${fml.fml.name}` as const])];
      break;
    case "box": {
      result = ctx.next[world]
        .map((w) => sat(frame, fml.fml, w, ctx))
        .reduce(
          (prev, current) =>
            maximal(
              current.flatMap((c1) =>
                prev.map((c2) => union(c1, c2)).filter(consistent),
              ),
              subsumes,
            ),
          [true],
        );
      break;
    }
    case "diamond": {
      result = maximal(
        ctx.next[world].flatMap((w) => sat(frame, fml.fml, w, ctx)),
        subsumes,
      );
      break;
    }
    case "and": {
      result = [
        sat(frame, fml.left, world, ctx),
        sat(frame, fml.right, world, ctx),
      ].reduce(
        (prev, current) =>
          maximal(
            current.flatMap((c1) =>
              prev.map((c2) => union(c1, c2)).filter(consistent),
            ),
            subsumes,
          ),
        [true],
      );
      break;
    }
    case "or": {
      result = maximal(
        [
          sat(frame, fml.left, world, ctx),
          sat(frame, fml.right, world, ctx),
        ].flat(),
        subsumes,
      );
      break;
    }
  }

  ctx.memo.set(key, result);
  return result;
}

export function validInWorld(frame: Frame, fml: Formula, world: World) {
  const ctx = buildContext(frame, fml);
  return sat(frame, ctx.notFml, world, ctx).length === 0;
}

export function validWorlds(frame: Frame, fml: Formula) {
  const ctx = buildContext(frame, fml);
  return worlds.filter(
    (world) => sat(frame, ctx.notFml, world, ctx).length === 0,
  );
}
