import type { SeoProps } from "#lib/components/seo/index.js";

export async function load() {
  return {
    seo: {
      title: "DJ / Composer - cannorin.net",
      openGraph: {
        title: "DJ / Composer - cannorin.net",
      },
      twitter: {
        title: "DJ / Composer - cannorin.net",
      },
    } as SeoProps,
  };
}
