import type { SeoProps } from "$components/seo";

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
