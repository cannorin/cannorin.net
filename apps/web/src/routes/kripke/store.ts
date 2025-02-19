import { persisted } from "svelte-persisted-store";
import type { Move } from "./game.svelte";
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
