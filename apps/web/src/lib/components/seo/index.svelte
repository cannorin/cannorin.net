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
import OpenGraphComponent from "./openGraph.svelte";
import type { SeoProps } from "./types";

let {
  title,
  description,
  keywords,
  base,
  applicationName,
  themeColor,
  nofollow,
  noindex,
  nositelinkssearchbox,
  notranslate,
  canonical,
  amp,
  manifest,
  languageAlternates,
  twitter,
  openGraph,
  facebook,
  jsonLd,
}: SeoProps = $props();
</script>

<svelte:head>
  {#if title}
    <title>{title}</title>
  {/if}

  {#if description}
    <meta name="description" content={description} />
  {/if}

  {#if canonical}
    <link rel="canonical" href={canonical} />
  {/if}

  {#if keywords}
    <meta name="keywords" content={keywords} />
  {/if}

  {#if amp}
    <link rel="amphtml" href={amp} />
  {/if}

  {#if manifest}
    <link rel="manifest" href={manifest} />
  {/if}

  {#if applicationName}
    <meta name="application-name" content={applicationName} />
  {/if}

  {#if languageAlternates}
    {#each languageAlternates as { href, hreflang }}
      <link rel="alternate" {href} {hreflang} />
    {/each}
  {/if}

  {#if themeColor}
    <meta name="theme-color" content={themeColor} />
  {/if}

  {#if base}
    <base href={base} />
  {/if}

  {#if facebook?.appId}
    <meta property="fb:app_id" content={facebook.appId} />
  {/if}

  <meta
    name="robots"
    content={`${noindex ? "noindex" : "index"},${
      nofollow ? "nofollow" : "follow"
    }`}
  />
  <meta
    name="googlebot"
    content={`${noindex ? "noindex" : "index"},${
      nofollow ? "nofollow" : "follow"
    }`}
  />

  {#if nositelinkssearchbox}
    <meta name="google" content="nositelinkssearchbox" />
  {/if}

  {#if notranslate}
    <meta name="google" content="notranslate" />
  {/if}

  {#if twitter}
    {#each Object.entries(twitter) as [key, value]}
      {@const transformed = key
        .replace(/([a-z])([A-Z])/g, "$1:$2")
        .toLowerCase()}
      <!-- The `transformed` variable changes eg, twitter.title into twitter:title
                It loops over all the properties and changes the '.' into ':'
            -->
      <meta name="twitter:{transformed}" content={value} />
    {/each}
  {/if}

  {#if openGraph}
    <OpenGraphComponent {openGraph} />
  {/if}

  {#if jsonLd}
    {@const data = Object.assign({ "@context": "https://schema.org" }, jsonLd)}
    {@html `<script type="application/ld+json">${
      JSON.stringify(data) + "<"
    }/script>`}
  {/if}
</svelte:head>
