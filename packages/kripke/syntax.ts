export type PropVar = "p" | "q" | "r" | "s";

export const propVars = ["p", "q", "r", "s"] as const satisfies PropVar[];

export type Formula =
  | { type: "top" | "bot" }
  | { type: "propvar"; name: PropVar }
  | { type: "not" | "box" | "diamond"; fml: Formula }
  | {
      type: "to" | "or" | "and" | "eq";
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
    case "eq":
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
export const eq = (left: Formula, right: Formula) =>
  ({ type: "eq", left, right }) as const satisfies Formula;

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
  eq: "<->",
};

export const unicodeSymbols: Symbols = {
  top: "⊤",
  bot: "⊥",
  box: "□",
  diamond: "◇",
  not: "¬",
  and: "∧",
  or: "∨",
  to: "→",
  eq: "↔",
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
  eq: "\\leftrightarrow",
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
    case "eq": {
      const newConfig: typeof config = {
        symbols,
        paren: (f) => f.type !== "eq",
      };
      return withParen(
        `${prettyPrint(fml.left, newConfig)} ${symbols.eq} ${prettyPrint(fml.right, newConfig)}`,
      );
    }
  }
}

export function simplify(fml: Formula): Formula {
  switch (fml.type) {
    case "top":
    case "bot":
    case "propvar":
      return fml;
    case "not":
    case "box":
    case "diamond": {
      const inner = simplify(fml.fml);
      if (fml.type === "not" && inner.type === "not") return inner.fml;
      if (fml.type === "not" && inner.type === "top") return bot;
      if (fml.type === "not" && inner.type === "bot") return top;
      if (fml.type === "box" && inner.type === "top") return top;
      if (fml.type === "diamond" && inner.type === "bot") return bot;

      return {
        type: fml.type,
        fml: inner,
      };
    }
    case "or":
    case "and":
    case "to":
    case "eq": {
      const innerLeft = simplify(fml.left);
      const innerRight = simplify(fml.right);

      if (fml.type === "and" && innerLeft.type === "top") return innerRight;
      if (fml.type === "and" && innerRight.type === "top") return innerLeft;
      if (
        fml.type === "and" &&
        (innerLeft.type === "bot" || innerRight.type === "bot")
      )
        return bot;
      if (fml.type === "or" && innerLeft.type === "bot") return innerRight;
      if (fml.type === "or" && innerRight.type === "bot") return innerLeft;
      if (
        fml.type === "or" &&
        (innerLeft.type === "top" || innerRight.type === "top")
      )
        return top;
      if (fml.type === "to" && innerLeft.type === "top") return innerRight;
      if (fml.type === "to" && innerLeft.type === "bot") return top;
      if (fml.type === "to" && innerRight.type === "top") return top;
      if (fml.type === "to" && innerRight.type === "bot")
        return simplify(not(innerLeft));
      if (fml.type === "eq" && innerLeft.type === "top") return innerRight;
      if (fml.type === "eq" && innerRight.type === "top") return innerLeft;
      if (fml.type === "eq" && innerRight.type === "bot")
        return simplify(not(innerLeft));
      if (fml.type === "eq" && innerLeft.type === "bot")
        return simplify(not(innerRight));

      return {
        type: fml.type,
        left: innerLeft,
        right: innerRight,
      };
    }
  }
}

export type NNFFormula<T = undefined> =
  | { type: "top" | "bot"; tag: T }
  | { type: "propvar"; name: PropVar; tag: T }
  | { type: "not"; fml: { type: "propvar"; name: PropVar; tag: T }; tag: T }
  | { type: "box" | "diamond"; fml: NNFFormula<T>; tag: T }
  | {
      type: "and" | "or";
      left: NNFFormula<T>;
      right: NNFFormula<T>;
      tag: T;
    };

export function toNNF(fml: Formula): NNFFormula {
  switch (fml.type) {
    case "top":
      return { ...fml, tag: undefined };
    case "bot":
      return { ...fml, tag: undefined };
    case "propvar":
      return { ...fml, tag: undefined };
    case "box": {
      return {
        type: "box",
        fml: toNNF(fml.fml),
        tag: undefined,
      };
    }
    case "diamond": {
      return {
        type: "diamond",
        fml: toNNF(fml.fml),
        tag: undefined,
      };
    }
    case "to": {
      return toNNF(or(not(fml.left), fml.right));
    }
    case "eq": {
      return toNNF(
        and(or(not(fml.left), fml.right), or(not(fml.right), fml.left)),
      );
    }
    case "or": {
      return {
        type: "or",
        left: toNNF(fml.left),
        right: toNNF(fml.right),
        tag: undefined,
      };
    }
    case "and": {
      return {
        type: "and",
        left: toNNF(fml.left),
        right: toNNF(fml.right),
        tag: undefined,
      };
    }
    case "not": {
      switch (fml.fml.type) {
        case "top":
          return { ...bot, tag: undefined };
        case "bot":
          return { ...top, tag: undefined };
        case "propvar":
          return {
            type: "not",
            fml: { ...fml.fml, tag: undefined },
            tag: undefined,
          };
        case "not":
          return toNNF(fml.fml.fml);
        case "box":
          return {
            type: "diamond",
            fml: toNNF(not(fml.fml.fml)),
            tag: undefined,
          };
        case "diamond":
          return { type: "box", fml: toNNF(not(fml.fml.fml)), tag: undefined };
        case "or":
          return {
            type: "and",
            left: toNNF(not(fml.fml.left)),
            right: toNNF(not(fml.fml.right)),
            tag: undefined,
          };
        case "and":
          return {
            type: "or",
            left: toNNF(not(fml.fml.left)),
            right: toNNF(not(fml.fml.right)),
            tag: undefined,
          };
        case "to":
          return {
            type: "and",
            left: toNNF(fml.fml.left),
            right: toNNF(not(fml.fml.right)),
            tag: undefined,
          };
        case "eq":
          return {
            type: "or",
            left: {
              type: "and",
              left: toNNF(fml.fml.left),
              right: toNNF(not(fml.fml.right)),
              tag: undefined,
            },
            right: {
              type: "and",
              left: toNNF(not(fml.fml.left)),
              right: toNNF(fml.fml.right),
              tag: undefined,
            },
            tag: undefined,
          };
      }
    }
  }
}

export function tagNNF<T, U>(
  fml: NNFFormula<T>,
  tagger: (fml: Omit<NNFFormula<T>, "tag">, tag: T) => U,
): NNFFormula<U> {
  switch (fml.type) {
    case "top":
    case "bot":
    case "propvar":
      return { ...fml, tag: tagger(fml, fml.tag) };
    case "not":
      return {
        type: "not",
        fml: {
          type: "propvar",
          name: fml.fml.name,
          tag: tagger(fml.fml, fml.fml.tag),
        },
        tag: tagger(fml, fml.tag),
      };
    case "box":
    case "diamond":
      return {
        type: fml.type,
        fml: tagNNF(fml.fml, tagger),
        tag: tagger(fml, fml.tag),
      };
    case "and":
    case "or":
      return {
        type: fml.type,
        left: tagNNF(fml.left, tagger),
        right: tagNNF(fml.right, tagger),
        tag: tagger(fml, fml.tag),
      };
  }
}
