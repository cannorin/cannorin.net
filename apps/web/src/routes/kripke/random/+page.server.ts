import type { SeoProps } from "$components/seo";
import { randomSeed } from "../system.js";

export async function load({ url }) {
  const seedStr = url.searchParams.get("seed");
  const seed = (() => {
    try {
      if (!seedStr) return randomSeed();
      const seed = Number.parseInt(seedStr);
      if (!Number.isSafeInteger(seed)) return randomSeed();
      return seed;
    } catch {
      return randomSeed();
    }
  })();

  return {
    seed,
    seo: {
      title: "KRIPKE (random challenge) - cannorin.net",
      description: "KRIPKE - WORDLE, but for Kripke frames!",
      openGraph: {
        title: "KRIPKE (random challenge) - cannorin.net",
        description: "KRIPKE - WORDLE, but for Kripke frames!",
      },
      twitter: {
        title: "KRIPKE (random challenge) - cannorin.net",
        description: "KRIPKE - WORDLE, but for Kripke frames!",
      },
    } as SeoProps,
  };
}
