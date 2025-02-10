<script lang="ts">
import "prismjs/themes/prism.min.css";
import "katex/dist/katex.min.css";

import { limitWidth } from "$lib/constants";
import { cn } from "$lib/utils";

let { children, data } = $props();

let date = new Date(data.date);
</script>

<main class={cn(limitWidth, "flex flex-col items-center gap-12 lg:gap-16")}>
  <article class="w-full max-w-[720px] space-y-12">
    <header class="flex flex-col gap-4">
      <h1 class="text-2xl">
        <span style="view-transition-name: article-{data.slug}-title">
          {data.title}
        </span>
      </h1>
      <div class="text-sm flex flex-wrap-reverse justify-between" style="view-transition-name: article-{data.slug}-meta">
        <ul class="flex gap-3">
          <li class="text-primary font-bold">#{data.category}</li>
          {#each data.tags ?? [] as tag}
            <li>#{tag}</li>
          {/each}
        </ul>
        <time datetime={date.toISOString()}>{date.getFullYear()}.{date.getMonth() + 1}.{date.getDate()}</time>
      </div>
    </header>

    <div class="prose prose-sm prose-light !max-w-fit">
      {@render children()}
    </div>
  </article>
</main>
