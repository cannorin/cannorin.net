import type { SeoProps } from "#lib/components/seo/index.js";

export async function load() {
  return {
    seo: {
      title: "Developer - cannorin.net",
      openGraph: {
        title: "Developer - cannorin.net",
      },
      twitter: {
        title: "Developer - cannorin.net",
      },
    } as SeoProps,
  };
}
