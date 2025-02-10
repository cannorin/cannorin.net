import adapter from "@sveltejs/adapter-auto";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { mdsvex } from "mdsvex";
import rehypeExternalLinks from "rehype-external-links";
import rehypeKatex from "rehype-katex-svelte";
import remarkFootnotes from "remark-footnotes";
import remarkMath from "remark-math";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: [".svelte", ".md"],

  // Consult https://svelte.dev/docs/kit/integrations
  // for more information about preprocessors
  preprocess: [
    mdsvex({
      extensions: [".md"],
      remarkPlugins: [remarkMath, remarkFootnotes],
      rehypePlugins: [
        rehypeKatex,
        [
          rehypeExternalLinks,
          { rel: ["nofollow", "noopener", "noreferrer"], target: "_blank" },
        ],
      ],
    }),
    vitePreprocess(),
  ],

  kit: {
    // adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
    // If your environment is not supported, or you settled on a specific environment, switch out the adapter.
    // See https://svelte.dev/docs/kit/adapters for more information about adapters.
    adapter: adapter(),

    alias: {
      $lib: "src/lib",
      $components: "src/lib/components",
      $assets: "src/assets",
      $: "src",
    },
  },
};

export default config;
