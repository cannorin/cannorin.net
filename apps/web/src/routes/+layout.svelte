<script lang="ts">
import "../app.css";
import "./webfont.css";

import { page } from "$app/state";
import { PUBLIC_WEB_DOMAIN } from "$env/static/public";
import { defaultSeo, mergeSeo } from "$lib/common/seo";
import SvelteSeo from "svelte-seo";

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

<SvelteSeo {...seo} />

{@render children()}
