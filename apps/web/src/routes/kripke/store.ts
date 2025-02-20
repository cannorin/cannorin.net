import { persisted } from "svelte-persisted-store";
import type { Move } from "./components/game.svelte";
import { date } from "./lib/system";

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
