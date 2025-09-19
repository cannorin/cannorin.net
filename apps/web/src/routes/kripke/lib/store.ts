import { MultiSet } from "@cannorin/utils/multiset";
import { persisted } from "svelte-persisted-store";
import type { Move } from "../components/game.svelte";
import { date } from "./system";

export type Daily = {
  date: string;
  moves: Move[];
};

export const daily = persisted<Daily>(
  "daily",
  {
    date: date(),
    moves: [],
  },
  {
    syncTabs: true,
    storage: "local",
    beforeRead: (value) => {
      if (value.date !== date()) return { date: date(), moves: [] };
      return value;
    },
  },
);

export type FormulaHistory = MultiSet<string>;

export const formulaHistory = persisted<
  FormulaHistory,
  readonly [string, number][]
>("formula-history", new MultiSet(), {
  syncTabs: true,
  storage: "local",
  beforeWrite: (val) => [...val],
  beforeRead: (val) => new MultiSet(val),
});
