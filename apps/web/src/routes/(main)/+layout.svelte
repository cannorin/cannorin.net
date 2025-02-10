<script lang="ts">
import { page } from "$app/state";
import { limitWidth } from "$lib/constants";
import { cn } from "$lib/utils";
import LuCopyleft from "lucide-svelte/icons/copyleft";

let { children } = $props();
</script>

<div class="flex flex-col min-h-screen items-center gap-12 lg:gap-16 py-8">
  <header class="flex flex-col items-center w-full gap-4">
    <div class="font-display text-4xl md:text-5xl lg:text-6xl">
      {#if page.url.pathname === "/"}
        cannorin.net
      {:else}
        <a href="/">cannorin.net</a>
      {/if}
    </div>
  </header>

  {@render children()}

  <footer class={cn(limitWidth, "mt-auto flex items-center flex-col gap-1 lg:flex-row lg:gap-2 lg:justify-center text-xs")}>
    <p class="flex gap-1 items-end">
      <LuCopyleft aria-label="Copyleft" size=12 /> 2024 cannorin. Some rights reserved.
    </p>
    <p>
      The text of this website is licensed under <a class="underline" href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank">CC BY-SA 4.0</a>.
    </p>
    <p>
      Code examples are licensed under the <a class="underline" href="https://spdx.org/licenses/MIT.html" target="_blank">MIT License</a>.
    </p>
  </footer>
</div>
