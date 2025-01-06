import type { ComponentProps } from "svelte";
import type SvelteSeo from "svelte-seo";

import deepmerge from "deepmerge";

export type Seo = ComponentProps<SvelteSeo>;

export const defaultSeo: Seo = {
  title: "cannorin.net",
  description: "cannorin's website",
  themeColor: "#fafafa",

  openGraph: {
    title: "cannorin.net",
    type: "website",
    description: "cannorin's website",
    locale: "ja_JP",
  },

  twitter: {
    title: "cannorin.net",
    description: "cannorin's website",
    card: "summary",
    creator: "cannorin3",
  },
};

export const mergeSeo = (
  target: Seo,
  ...sources: (Seo | undefined | false)[]
) =>
  sources.reduce<Seo>(
    (acc, current) =>
      deepmerge(acc, current || {}, {
        arrayMerge: (_target, source) => source,
      }),
    target,
  );
