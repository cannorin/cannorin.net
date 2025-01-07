// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import "@poppanator/sveltekit-svg/dist/svg";

declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }

  declare module "*.md" {
    import type { Component, SvelteComponent } from "svelte";
    const content: Component<HTMLAttributes<HTMLElement>>;
    export default content;
    export const metadata: Record<string, unknown>;
  }
}
