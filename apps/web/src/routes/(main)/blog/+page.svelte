<script lang="ts">
import "prismjs/themes/prism.min.css";

import { limitWidth } from "$lib/constants";
import { cn } from "$lib/utils";

let { data } = $props();
</script>

<main class={cn(limitWidth, "flex flex-col items-center gap-12 lg:gap-16")}>
  <div class="flex flex-col gap-6 w-full max-w-[720px]">
    {#each data.posts as post}
      {@const date = new Date(post.date)}
      <article>
        <h1 class="text-lg">
          <a href="/blog/{post.slug}" style="view-transition-name: article-{post.slug}-title">
            {post.title}
          </a>
        </h1>
        <div class="text-xs flex flex-wrap-reverse justify-between" style="view-transition-name: article-{post.slug}-meta">
          <ul class="flex gap-3">
            <li class="text-primary font-bold">#{post.category}</li>
            {#each post.tags ?? [] as tag}
              <li>#{tag}</li>
            {/each}
          </ul>
          <time datetime={date.toISOString()}>{date.getFullYear()}.{date.getMonth() + 1}.{date.getDate()}</time>
        </div>
      </article>
    {/each}
  </div>
</main>
