<script lang="ts">
import "../app.css";
import "./webfont.css";

import { onNavigate } from "$app/navigation";
import { page } from "$app/state";
import Seo, { defaultSeo, mergeSeo } from "$components/seo";
import { PUBLIC_WEB_DOMAIN } from "$env/static/public";

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

{@render children()}
