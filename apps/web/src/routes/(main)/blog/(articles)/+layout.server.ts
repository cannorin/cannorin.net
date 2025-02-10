import { data } from "./data";

export async function load({ url }) {
  const slug = url.pathname.split("/").slice(-1)[0];
  const path = `/src/routes/(main)/blog/(articles)/${slug}/+page.md`;
  return { ...data[path].metadata, slug };
}
