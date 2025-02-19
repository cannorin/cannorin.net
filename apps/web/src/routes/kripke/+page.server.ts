import type { SeoProps } from "$components/seo";

export async function load() {
  return {
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
