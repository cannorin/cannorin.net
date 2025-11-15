import type {} from "@cannorin/utils/headless";
import {
  alt,
  apply,
  buildLexer,
  expectEOF,
  expectSingleResult,
  kmid,
  lrec_sc,
  rule,
  seq,
  type Token,
  tok,
} from "typescript-parsec";
import {
  and,
  bot,
  box,
  diamond,
  eq,
  type Formula,
  not,
  or,
  propVars,
  propvar,
  to,
  top,
} from "./syntax";

enum TokenKind {
  PropVar = 0,
  Top = 1,
  Bot = 2,
  Not = 3,
  Box = 4,
  Diamond = 5,
  And = 6,
  Or = 7,
  To = 8,
  Eq = 9,
  LParen = 10,
  RParen = 11,
  Space = 12,
}

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const generateAlt = (words: string[]) =>
  new RegExp(`^(${words.map((s) => escapeRegExp(s)).join("|")})`, "g");

export const topSymbols = ["⊤", "T", "1", "\\top", "top"];
export const botSymbols = ["⊥", "F", "0", "\\bot", "bot"];
export const notSymbols = ["¬", "~", "\\neg", "\\lnot", "not"];
export const boxSymbols = ["□", "◻", "[]", "!", "L", "\\Box", "box"];
export const diamondSymbols = [
  "◇",
  "◊",
  "♢",
  "⋄",
  "<>",
  "?",
  "M",
  "\\Diamond",
  "dia",
];
export const andSymbols = ["∧", "^", "&", "\\wedge", "\\land", "and"];
export const orSymbols = ["∨", "v", "|", "\\vee", "\\lor", "or"];
export const toSymbols = ["→", "->", "⊃", ">", "\\rightarrow", "\\to", "to"];
export const eqSymbols = [
  "↔",
  "<->",
  "≡",
  "=",
  "\\leftrightarrow",
  "\\equiv",
  "eq",
];
export const lParenSymbols = ["(", "\\left"];
export const rParenSymbols = [")", "\\right"];

const lexer = buildLexer([
  [true, generateAlt(propVars), TokenKind.PropVar],
  [true, generateAlt(topSymbols), TokenKind.Top],
  [true, generateAlt(botSymbols), TokenKind.Bot],
  [true, generateAlt(notSymbols), TokenKind.Not],
  [true, generateAlt(boxSymbols), TokenKind.Box],
  [true, generateAlt(diamondSymbols), TokenKind.Diamond],
  [true, generateAlt(andSymbols), TokenKind.And],
  [true, generateAlt(orSymbols), TokenKind.Or],
  [true, generateAlt(toSymbols), TokenKind.To],
  [true, generateAlt(eqSymbols), TokenKind.Eq],
  [true, generateAlt(lParenSymbols), TokenKind.LParen],
  [true, generateAlt(rParenSymbols), TokenKind.RParen],
  [false, /^\s+/g, TokenKind.Space],
]);

function atom(
  value: Token<TokenKind.PropVar | TokenKind.Top | TokenKind.Bot>,
): Formula {
  switch (value.kind) {
    case TokenKind.PropVar: {
      if (propVars.includes(value.text)) {
        return propvar(value.text);
      }
      throw new Error(`Unknown atom: ${value.text}`);
    }
    case TokenKind.Top:
      return top;
    case TokenKind.Bot:
      return bot;
    default:
      throw new Error(`Unknown atom: ${value.text}`);
  }
}

function unary([op, value]: [
  Token<TokenKind.Not | TokenKind.Box | TokenKind.Diamond>,
  Formula,
]): Formula {
  switch (op.kind) {
    case TokenKind.Not:
      return not(value);
    case TokenKind.Box:
      return box(value);
    case TokenKind.Diamond:
      return diamond(value);
    default:
      throw new Error(`Unknown unary operator: ${op.text}`);
  }
}

function binary(
  left: Formula,
  [op, right]: [
    Token<TokenKind.And | TokenKind.Or | TokenKind.To | TokenKind.Eq>,
    Formula,
  ],
): Formula {
  switch (op.kind) {
    case TokenKind.And:
      return and(left, right);
    case TokenKind.Or:
      return or(left, right);
    case TokenKind.To:
      return to(left, right);
    case TokenKind.Eq:
      return eq(left, right);
    default:
      throw new Error(`Unknown binary operator: ${op.text}`);
  }
}

const TERM = rule<TokenKind, Formula>();
const ANDOR = rule<TokenKind, Formula>();
const EXP = rule<TokenKind, Formula>();

TERM.setPattern(
  alt(
    apply(
      alt(tok(TokenKind.PropVar), tok(TokenKind.Top), tok(TokenKind.Bot)),
      atom,
    ),
    apply(
      seq(
        alt(tok(TokenKind.Not), tok(TokenKind.Box), tok(TokenKind.Diamond)),
        TERM,
      ),
      unary,
    ),
    kmid(tok(TokenKind.LParen), EXP, tok(TokenKind.RParen)),
  ),
);

ANDOR.setPattern(
  lrec_sc(TERM, seq(alt(tok(TokenKind.And), tok(TokenKind.Or)), ANDOR), binary),
);

EXP.setPattern(
  lrec_sc(ANDOR, seq(alt(tok(TokenKind.To), tok(TokenKind.Eq)), EXP), binary),
);

export function parse(expr: string): Formula {
  return expectSingleResult(expectEOF(EXP.parse(lexer.parse(expr))));
}

export function tryParse(expr: string): Formula | undefined {
  try {
    return parse(expr);
  } catch {
    return undefined;
  }
}
