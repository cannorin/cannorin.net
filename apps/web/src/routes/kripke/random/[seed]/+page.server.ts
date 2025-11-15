import { error } from "@sveltejs/kit";
import type { SeoProps } from "$components/seo";

export async function load({ params }) {
  const seedStr = params.seed;
  const seed = (() => {
    try {
      const seed = Number.parseInt(seedStr, 10);
      if (!Number.isSafeInteger(seed)) throw error(400);
      return seed;
    } catch {
      throw error(400);
    }
  })();

  return {
    seed,
    seo: {
      title: `KRIPKE (seed ${seed}) - cannorin.net`,
      description: "KRIPKE - WORDLE, but for Kripke frames!",
      openGraph: {
        title: `KRIPKE (seed ${seed}) - cannorin.net`,
        description: "KRIPKE - WORDLE, but for Kripke frames!",
      },
      twitter: {
        title: `KRIPKE (seed ${seed}) - cannorin.net`,
        description: "KRIPKE - WORDLE, but for Kripke frames!",
      },
    } as SeoProps,
  };
}
