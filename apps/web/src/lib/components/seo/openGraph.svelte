<!--
Forked from artiebits/svelte-seo
================================

MIT License

Copyright (c) 2020 artiebits

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
-->

<script lang="ts">
import type { SeoProps } from "./types";

let { openGraph }: { openGraph?: SeoProps["openGraph"] } = $props();
</script>

{#if openGraph}
  {#each Object.entries(openGraph) as [key, value]}
    <!-- For openGraph, some of the keys have values as objects so we need to check
    before.
    -->
    {@const _type = typeof value}
    {#if _type !== "object"}
      {@const transform = key.replace(/([a-z])([A-Z])/g, "$1:$2").toLowerCase()}
      <meta property="og:{transform}" content={value} />
    {/if}
    {#if _type === "object"}
      {#if key === "images"}
        {#each openGraph.images ?? [] as image}
          {#each Object.entries(image) as [key, value]}
            <meta property="og:image:{key}" content={value.toString()} />
          {/each}
        {/each}
      {:else if key === "videos"}
        {#each openGraph.videos ?? [] as video}
          {#each Object.entries(video) as [key, value]}
            {#if key === "url"}
              <meta property="og:video" content={value.toString()} />
            {:else}
              <meta property="og:video:{key}" content={value.toString()} />
            {/if}
          {/each}
        {/each}
      {:else if key === "localeAlternate"}
        {#each openGraph.localeAlternate ?? [] as alternate}
          <meta property="og:locale:alternate" content={alternate} />
        {/each}
      {:else if key === "music"}
        {#each Object.entries(openGraph.music ?? {}) as [key, value]}
          {@const transform = key
            .replace(/([a-z])([A-Z])/g, "$1:$2")
            .toLowerCase()}
          <meta property="music:{transform}" content={value.toString()} />
        {/each}
      {:else if key === "movie"}
        {#each Object.entries(openGraph.movie ?? {}) as [key, value]}
          {#if typeof value === "object"}
            {#each value as propValue}
              <meta property="video:{key}" content={propValue} />
            {/each}
          {:else}
            {@const transform = key
              .replace(/([a-z])([A-Z])/g, "$1:$2")
              .toLowerCase()}
            <meta property="video:{transform}" content={value.toString()} />
          {/if}
        {/each}
      {:else if key === "article"}
        {#each Object.entries(openGraph.article ?? {}) as [key, value]}
          {#if typeof value === "object"}
            {#each value as propValue}
              <meta property="article:{key}" content={propValue} />
            {/each}
          {:else}
            {@const transform = key
              .replace(/([a-z])([A-Z])/g, "$1:$2")
              .toLowerCase()}
            <meta property="article:{transform}" content={value.toString()} />
          {/if}
        {/each}
      {:else if key === "book"}
        {#each Object.entries(openGraph.book ?? {}) as [key, value]}
          {#if typeof value === "object"}
            {#each value as propValue}
              <meta property="book:{key}" content={propValue} />
            {/each}
          {:else}
            {@const transform = key
              .replace(/([a-z])([A-Z])/g, "$1:$2")
              .toLowerCase()}
            <meta property="book:{transform}" content={value.toString()} />
          {/if}
        {/each}
      {:else if key === "profile"}
        {#each Object.entries(openGraph.profile ?? {}) as [key, value]}
          {@const transform = key
            .replace(/([a-z])([A-Z])/g, "$1:$2")
            .toLowerCase()}
          <meta property="profile:{transform}" content={value} />
        {/each}
      {/if}
    {/if}
  {/each}
{/if}
