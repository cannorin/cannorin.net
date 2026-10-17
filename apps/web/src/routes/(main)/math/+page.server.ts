import type { SeoProps } from "#lib/components/seo/index.js";

export async function load() {
  return {
    seo: {
      title: "Graduate Student - cannorin.net",
      openGraph: {
        title: "Graduate Student - cannorin.net",
      },
      twitter: {
        title: "Graduate Student - cannorin.net",
      },
    } as SeoProps,
  };
}
