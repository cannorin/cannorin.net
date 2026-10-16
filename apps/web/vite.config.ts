import svg from "@poppanator/sveltekit-svg";
import adapter from "@sveltejs/adapter-auto";
import { enhancedImages } from "@sveltejs/enhanced-img";
import { sveltekit } from "@sveltejs/kit/vite";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { mdsvex } from "mdsvex";
import rehypeExternalLinks from "rehype-external-links";
import rehypeKatex from "rehype-katex-svelte";
import remarkFootnotes from "remark-footnotes";
import remarkMath from "remark-math";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    enhancedImages(),
    sveltekit({
      extensions: [".svelte", ".md"],
      preprocess: [
        mdsvex({
          extensions: [".md"],
          remarkPlugins: [remarkMath, remarkFootnotes],
          // shortcut: mdsvex and rehype resolve different unified types, remove the cast when their types converge
          rehypePlugins: [
            rehypeKatex,
            [
              rehypeExternalLinks,
              {
                rel: ["nofollow", "noopener", "noreferrer"],
                target: "_blank",
              },
            ],
          ] as never[],
        }),
        vitePreprocess(),
      ],
      adapter: adapter(),
    }),
    svg({
      includePaths: ["./src/assets"],
      svgoOptions: false,
    }),
  ],
  build: {
    assetsInlineLimit: 1024,
  },
});
