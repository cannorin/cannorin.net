import type { SeoProps } from "$components/seo";
import { dailySeed } from "./lib/system";

export async function load() {
  const seed = dailySeed();

  return {
    seed,
    seo: {
      title: "KRIPKE - cannorin.net",
      description: "KRIPKE - WORDLE, but for Kripke frames!",
      openGraph: {
        title: "KRIPKE - cannorin.net",
        description: "KRIPKE - WORDLE, but for Kripke frames!",
      },
      twitter: {
        title: "KRIPKE - cannorin.net",
        description: "KRIPKE - WORDLE, but for Kripke frames!",
      },
    } as SeoProps,
  };
}
