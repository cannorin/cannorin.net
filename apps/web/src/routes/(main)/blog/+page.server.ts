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
  return { posts };
}
