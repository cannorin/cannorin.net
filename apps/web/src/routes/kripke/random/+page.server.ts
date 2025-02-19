import type { SeoProps } from "$components/seo";

export async function load() {
  return {
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
