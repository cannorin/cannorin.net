<script lang="ts">
import "../app.css";
import "./webfont.css";

import { sineOut } from "svelte/easing";
import { fade } from "svelte/transition";
import { browser } from "$app/environment";
import { onNavigate } from "$app/navigation";
import { page } from "$app/state";
import Seo, { defaultSeo, mergeSeo } from "$components/seo";
import { PUBLIC_WEB_DOMAIN } from "$env/static/public";

let viewTransition = !browser || !!document.startViewTransition;

let { children } = $props();
let seo = $derived.by(() =>
  mergeSeo(defaultSeo, page.data.seo, {
    canonical: `https://${PUBLIC_WEB_DOMAIN}${page.url.pathname}`,
    openGraph: {
      url: `https://${PUBLIC_WEB_DOMAIN}${page.url.pathname}`,
    },
  }),
);

onNavigate((navigation) => {
  if (!document.startViewTransition) return;
  return new Promise((resolve) => {
    document.startViewTransition(async () => {
      resolve();
      await navigation.complete;
    });
  });
});
</script>

<Seo {...seo} />

{#if viewTransition}
  {@render children()}
{:else}
  <div class="grid grid-cols-1 min-h-screen">
    {#key page.url.pathname}
      <div class="row-start-1 col-start-1" transition:fade={{ duration: 200, easing: sineOut }}>
        {@render children()}
      </div>
    {/key}
  </div>
{/if}

<style lang="postcss">
  @view-transition {
    navigation: auto;
  }

  ::view-transition-group(*) {
    animation-duration: 0.2s;
  }
</style>
