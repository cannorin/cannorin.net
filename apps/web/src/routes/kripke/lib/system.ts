import { getFrame, nontrivials } from "@cannorin/kripke";

function cyrb53(str: string, seed = 0): number {
  let h1 = 0xdeadbeef ^ seed;
  let h2 = 0x41c6ce57 ^ seed;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 =
    Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^
    Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 =
    Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^
    Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  // Combine the two 32-bit hashes into a single 53-bit integer
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}

export const date = () => new Date().toISOString().split("T")[0];

export const dailySeed = () => {
  const dateStr = date();
  return cyrb53(dateStr) % 0x100000000;
};

export const randomSeed = () => Math.floor(Math.random() * 0x100000000);

export function getFrameBySeed(seed: number) {
  const hash = cyrb53("random", seed);
  const index = hash % nontrivials.length;
  return {
    id: nontrivials[index],
    frame: getFrame(nontrivials[index]),
  };
}

export function getTimeUntilNextGame() {
  const now = new Date();
  const nextDayUTC = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1),
  );
  const deltaSeconds = (nextDayUTC.getTime() - now.getTime()) / 1000;
  const pad = (num: number) => `0${num}`.slice(-2);
  return {
    hours: pad(Math.floor(deltaSeconds / 3600)),
    minutes: pad(Math.floor((deltaSeconds % 3600) / 60)),
    seconds: pad(Math.floor(deltaSeconds % 60)),
  };
}
