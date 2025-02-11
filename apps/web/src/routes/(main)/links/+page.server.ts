import type { SeoProps } from "$lib/components/seo";

export async function load() {
  return {
    seo: {
      title: "links - cannorin.net",
      description: "other links and recommendations",
      openGraph: {
        title: "links - cannorin.net",
        description: "other links and recommendations",
      },
      twitter: {
        title: "links - cannorin.net",
        description: "other links and recommendations",
      },
    } as SeoProps,
  };
}
