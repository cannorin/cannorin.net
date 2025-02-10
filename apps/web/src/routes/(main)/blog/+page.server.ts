import type { SeoProps } from "$lib/components/seo";
import { type Metadata, data } from "./(articles)/data";

export async function load() {
  const posts: (Metadata & { slug: string })[] = [];
  for (const path in data) {
    const post = data[path];
    const slug = path
      .replace("/src/routes/(main)/blog/(articles)/", "")
      .replace("/+page.md", "");
    posts.push({
      ...post.metadata,
      slug,
    });
  }
  return {
    posts: posts.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    ),
    seo: {
      title: "blog - cannorin.net",
      description: "cannorin's blog",
      openGraph: {
        title: "blog - cannorin.net",
        description: "cannorin's blog",
      },
      twitter: {
        title: "blog - cannorin.net",
        description: "cannorin's blog",
      },
    } as SeoProps,
  };
}
