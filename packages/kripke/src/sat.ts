import { BitSet, maximal } from "@cannorin/utils";
import {
  type Frame,
  left,
  type Model,
  right,
  type World,
  worlds,
} from "./semantics";
import {
  type Formula,
  type NNFFormula,
  not,
  propVars,
  simplify,
  tagNNF,
  toNNF,
} from "./syntax";

const allValuations = worlds.flatMap((w) =>
  propVars.map((p) => `${w}${p}` as const),
);

const valuationSet = new BitSet(allValuations);

export type Constraints = {
  positive: number;
  negative: number;
};

const empty: Constraints = {
  positive: valuationSet.empty,
  negative: valuationSet.empty,
};

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
          if (xs.some((x) => x === false))
            constant.set(`${w1}:${f.tag}`, false);
          if (xs.every((x) => x === true)) constant.set(`${w1}:${f.tag}`, true);
        }
        return;
      }
      case "diamond": {
        addConstants(f.fml);
        for (const w1 of worlds) {
          const xs = next[w1].map((w2) => constant.get(`${w2}:${f.fml.tag}`));
          if (xs.some((x) => x === true)) constant.set(`${w1}:${f.tag}`, true);
          if (xs.every((x) => x === false))
            constant.set(`${w1}:${f.tag}`, false);
        }
        return;
      }
      case "or": {
        addConstants(f.left);
        addConstants(f.right);
        for (const w of worlds) {
          const l = constant.get(`${w}:${f.left.tag}`);
          const r = constant.get(`${w}:${f.right.tag}`);
          if (l === true || r === true) constant.set(`${w}:${f.tag}`, true);
          else if (l === false && r === false)
            constant.set(`${w}:${f.tag}`, false);
        }
        return;
      }
      case "and": {
        addConstants(f.left);
        addConstants(f.right);
        for (const w of worlds) {
          const l = constant.get(`${w}:${f.left.tag}`);
          const r = constant.get(`${w}:${f.right.tag}`);
          if (l === false || r === false) constant.set(`${w}:${f.tag}`, false);
          if (l === true && r === true) constant.set(`${w}:${f.tag}`, true);
        }
        return;
      }
    }
  }
  addConstants(notFml);

  return { notFml, next, memo: new Map(), constant };
}

const isWeaker = (c1: Constraints, c2: Constraints): boolean => {
  return (
    valuationSet.isSuperset(c1.positive, c2.positive) &&
    valuationSet.isSuperset(c1.negative, c2.negative)
  );
};

const union = (c1: Constraints, c2: Constraints): Constraints => {
  return {
    positive: valuationSet.union(c1.positive, c2.positive),
    negative: valuationSet.union(c1.negative, c2.negative),
  };
};

const consistent = (c: Constraints) => {
  return valuationSet.isDisjoint(c.positive, c.negative);
};

function sat(
  frame: Frame,
  fml: NNFFormula<number>,
  world: World,
  ctx: Context = buildContext(frame, fml),
): Constraints[] {
  const key = `${world}:${fml.tag}` as const;
  const c = ctx.constant.get(key);
  if (c === true) return [empty];
  if (c === false) return [];

  let result = ctx.memo.get(key);
  if (result) return result;

  switch (fml.type) {
    case "top":
      result = [empty];
      break;
    case "bot":
      result = [];
      break;
    case "propvar":
      result = [
        {
          positive: valuationSet.create(`${world}${fml.name}`),
          negative: valuationSet.empty,
        },
      ];
      break;
    case "not":
      result = [
        {
          positive: valuationSet.empty,
          negative: valuationSet.create(`${world}${fml.fml.name}`),
        },
      ];
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
              isWeaker,
            ),
          [empty],
        );
      break;
    }
    case "diamond": {
      result = maximal(
        ctx.next[world].flatMap((w) => sat(frame, fml.fml, w, ctx)),
        isWeaker,
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
            isWeaker,
          ),
        [empty],
      );
      break;
    }
    case "or": {
      result = maximal(
        [
          sat(frame, fml.left, world, ctx),
          sat(frame, fml.right, world, ctx),
        ].flat(),
        isWeaker,
      );
      break;
    }
  }

  ctx.memo.set(key, result);
  return result;
}

export function findCountermodelsAt(
  frame: Frame,
  fml: Formula,
  world: World,
  ctx = buildContext(frame, fml),
): Model[] {
  return sat(frame, ctx.notFml, world, ctx).map(({ positive }) => ({
    ...frame,
    valuations: valuationSet.decode(positive),
  }));
}

export function findCountermodels(
  frame: Frame,
  fml: Formula,
  ctx = buildContext(frame, fml),
): Model[] {
  return maximal(
    worlds.flatMap((world) => sat(frame, ctx.notFml, world, ctx)),
    isWeaker,
  ).map(({ positive }) => ({
    ...frame,
    valuations: valuationSet.decode(positive),
  }));
}

export function validInWorld(
  frame: Frame,
  fml: Formula,
  world: World,
  ctx = buildContext(frame, fml),
) {
  return sat(frame, ctx.notFml, world, ctx).length === 0;
}

export function validWorlds(
  frame: Frame,
  fml: Formula,
  ctx = buildContext(frame, fml),
) {
  return worlds.filter((world) => validInWorld(frame, ctx.notFml, world, ctx));
}

export function validInFrame(
  frame: Frame,
  fml: Formula,
  ctx = buildContext(frame, fml),
) {
  return worlds.every((world) => validInWorld(frame, ctx.notFml, world, ctx));
}
