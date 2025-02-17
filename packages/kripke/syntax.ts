export type PropVar = "p" | "q" | "r" | "s";

export const propVars: PropVar[] = ["p", "q", "r", "s"];

export type Formula =
  | { type: "top" | "bot" }
  | { type: "propvar"; name: PropVar }
  | { type: "not" | "box" | "diamond"; fml: Formula }
  | {
      type: "to" | "or" | "and" | "iff";
      left: Formula;
      right: Formula;
    };

export function vars(fml: Formula): Set<PropVar> {
  switch (fml.type) {
    case "top":
    case "bot":
      return new Set();
    case "box":
    case "diamond":
    case "not":
      return vars(fml.fml);
    case "to":
    case "or":
    case "and":
    case "iff":
      return new Set([...vars(fml.left), ...vars(fml.right)]);
    case "propvar":
      return new Set([fml.name]);
  }
}

export const propvar = (name: PropVar) => ({ type: "propvar", name }) as const;

export const top = { type: "top" } as const satisfies Formula;
export const bot = { type: "bot" } as const satisfies Formula;

export const box = (fml: Formula) =>
  ({ type: "box", fml }) as const satisfies Formula;
export const diamond = (fml: Formula) =>
  ({ type: "diamond", fml }) as const satisfies Formula;
export const not = (fml: Formula) =>
  ({ type: "not", fml }) as const satisfies Formula;

export const to = (left: Formula, right: Formula) =>
  ({ type: "to", left, right }) as const satisfies Formula;
export const and = (left: Formula, right: Formula) =>
  ({ type: "and", left, right }) as const satisfies Formula;
export const or = (left: Formula, right: Formula) =>
  ({ type: "or", left, right }) as const satisfies Formula;
export const iff = (left: Formula, right: Formula) =>
  ({ type: "iff", left, right }) as const satisfies Formula;

export type Symbols = Record<Exclude<Formula["type"], "propvar">, string>;

export const asciiSymbols: Symbols = {
  top: "T",
  bot: "F",
  box: "[]",
  diamond: "<>",
  not: "~",
  and: "^",
  or: "v",
  to: "->",
  iff: "<->",
};

export const unicodeSymbols: Symbols = {
  top: "⊤",
  bot: "⊥",
  box: "□",
  diamond: "⋄",
  not: "¬",
  and: "∧",
  or: "∨",
  to: "→",
  iff: "↔",
};

export const latexSymbols: Symbols = {
  top: "\\top ",
  bot: "\\bot ",
  box: "\\Box ",
  diamond: "\\Diamond ",
  not: "\\neg ",
  and: "\\land",
  or: "\\lor",
  to: "\\to",
  iff: "\\leftrightarrow",
};

export function prettyPrint(
  fml: Formula,
  config?: { paren?: boolean | ((fml: Formula) => boolean); symbols?: Symbols },
): string {
  const { paren = false, symbols = unicodeSymbols } = config ?? {};
  const withParen = (s: string) =>
    (typeof paren === "boolean" ? paren : paren(fml)) ? `(${s})` : s;

  switch (fml.type) {
    case "top":
      return symbols.top;
    case "bot":
      return symbols.bot;
    case "propvar":
      return fml.name;
    case "not":
      return `${symbols.not}${prettyPrint(fml.fml, { paren: true, symbols })}`;
    case "box":
      return `${symbols.box}${prettyPrint(fml.fml, { paren: true, symbols })}`;
    case "diamond":
      return `${symbols.diamond}${prettyPrint(fml.fml, { paren: true, symbols })}`;
    case "and": {
      const newConfig: typeof config = {
        symbols,
        paren: (f) => f.type !== "and",
      };
      return withParen(
        `${prettyPrint(fml.left, newConfig)} ${symbols.and} ${prettyPrint(fml.right, newConfig)}`,
      );
    }
    case "or": {
      const newConfig: typeof config = {
        symbols,
        paren: (f) => f.type !== "or",
      };
      return withParen(
        `${prettyPrint(fml.left, newConfig)} ${symbols.or} ${prettyPrint(fml.right, newConfig)}`,
      );
    }
    case "to": {
      const newConfig: typeof config = {
        symbols,
        paren: (f) => f.type !== "to",
      };
      return withParen(
        `${prettyPrint(fml.left, { symbols, paren: true })} ${symbols.to} ${prettyPrint(fml.right, newConfig)}`,
      );
    }
    case "iff": {
      const newConfig: typeof config = {
        symbols,
        paren: (f) => f.type !== "iff",
      };
      return withParen(
        `${prettyPrint(fml.left, newConfig)} ${symbols.iff} ${prettyPrint(fml.right, newConfig)}`,
      );
    }
  }
}
