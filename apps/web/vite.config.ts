import svg from "@poppanator/sveltekit-svg";
import { enhancedImages } from "@sveltejs/enhanced-img";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    enhancedImages(),
    sveltekit(),
    svg({
      includePaths: ["./src/assets"],
      svgoOptions: false,
    }),
  ],
  build: {
    assetsInlineLimit: 1024,
  },
});
