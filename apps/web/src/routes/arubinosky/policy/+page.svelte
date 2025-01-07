<script lang="ts">
import Logo from "$assets/images/static/arubinosky/logo.svg?component";
import { limitWidth } from "$lib/constants";
import { cn } from "$lib/utils";
import Policy from "./policy.md";
</script>

<main class={cn(limitWidth, "flex grow flex-col items-center gap-10 py-8")}>
  <h1>
    <a href="/arubinosky">
      <Logo class="w-full h-auto" role="presentation" />
      <span class="sr-only">あるびのすきー</span>
    </a>
  </h1>

  <section class="prose prose-sm !w-full !min-w-full rounded-xl p-6 bg-white">
    <Policy />
  </section>
</main>
