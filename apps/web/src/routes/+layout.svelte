<script lang="ts">
import "../app.css";
import "./webfont.css";

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
</script>

<Seo {...seo} />

{@render children()}
