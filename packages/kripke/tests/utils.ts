import { sample } from "@cannorin/utils";
import { parse } from "../src/parser";
import { getFrame, nontrivials } from "../src/semantics";
import {
  and,
  bot,
  box,
  diamond,
  eq,
  type Formula,
  not,
  or,
  propvar,
  to,
  top,
} from "../src/syntax";

const formulaTypes = [
  "top",
  "bot",
  "propvar",
  "not",
  "and",
  "or",
  "to",
  "eq",
  "box",
  "diamond",
] as const satisfies Formula["type"][];

export const testFormulas: Formula[] = [
  parse("L(p -> q) -> (Lp -> Lq)"),
  parse("Lp -> p"),
  parse("LLp -> Lp"),
  parse("Lp -> LLp"),
  parse("Lp -> Mp"),
  parse("p -> LMp"),
  parse("Mp -> LMp"),
  parse("L(Lp -> p) -> Lp"),
  parse("L(L(p -> Lp) -> p) -> p"),
  parse("L(Lp -> q) v L(Lq -> p)"),
  parse("LMp -> MLp"),
  parse("MLp -> LMp"),
  parse("p -> Lp"),
  parse("Mp -> Lp"),
  parse("Mp <-> Lp"),
  parse("Lp"),
  parse("Lp v L(p -> q)"),
  parse("Lp v L(p -> q) v L(p&q -> r)"),

  parse("L(Lp -> p)"),
  parse("LLp -> p"),
  parse("p -> LLp"),

  parse("M(p -> Mp)"),
  parse("r -> M((p -> Mp) & Mr)"),
  parse("p -> MMp"),
  parse("M(p -> Lp)"),
  parse("L0"),
  parse("ML0"),
  parse("L(p -> Mp)"),
  parse("p -> MMMp"),
  parse("p -> MMMMp"),
  parse("M1"),
  parse("ML(p -> Mp)"),
  parse("Lp -> LMp"),
  parse("M(p -> LLp)"),

  // pathological
  parse("L(M(1 & p) v LM1) -> (s <-> 1)"),
  parse("L(M((q v ~q) & p) v LM(s v ~s)) -> (s <-> (p v ~p))"),
  parse("~(Lr & ¬Mp) & M~L(q v q)"),
];

export function randomFormula(depth = 5): Formula {
  const types = new Map([
    [5, ["not", "and", "or", "to", "eq", "box", "diamond"] as const],
    [4, ["not", "and", "or", "to", "eq", "box", "diamond"] as const],
    [0, ["top", "bot", "propvar", "propvar", "propvar", "propvar"] as const],
  ]);

  const type = sample(types.get(depth) ?? formulaTypes);
  switch (type) {
    case "top":
      return top;
    case "bot":
      return bot;
    case "propvar":
      return propvar(sample(["p", "q", "r"]));
    case "not":
      return not(randomFormula(depth - 1));
    case "and":
      return and(randomFormula(depth - 1), randomFormula(depth - 1));
    case "or":
      return or(randomFormula(depth - 1), randomFormula(depth - 1));
    case "to":
      return to(randomFormula(depth - 1), randomFormula(depth - 1));
    case "eq":
      return eq(randomFormula(depth - 1), randomFormula(depth - 1));
    case "box":
      return box(randomFormula(depth - 1));
    case "diamond":
      return diamond(randomFormula(depth - 1));
    default:
      throw new Error(`impossible: ${type}`);
  }
}

export function randomFrame() {
  return getFrame(sample(nontrivials));
}
