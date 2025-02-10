import type { SeoProps } from "$lib/components/seo";
import { data } from "./data";

export async function load({ url }) {
  const slug = url.pathname.split("/").slice(-1)[0];
  const path = `/src/routes/(main)/blog/(articles)/${slug}/+page.md`;
  const metadata = data[path].metadata;
  return {
    ...metadata,
    slug,
    seo: {
      title: `${metadata.title} - cannorin.net`,
      description: metadata.description,
      openGraph: {
        title: `${metadata.title} - cannorin.net`,
        type: "article",
        description: metadata.description,
        article: {
          published_time: metadata.date,
          author: ["cannorin"],
          tag: [metadata.category, ...(metadata.tags ?? [])],
        },
      },
      twitter: {
        title: `${metadata.title} - cannorin.net`,
        description: metadata.description,
        card: "summary",
      },
    } as SeoProps,
  };
}
