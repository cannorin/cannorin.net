import type { SeoProps } from "./types";

export * from "./types";

import deepmerge from "deepmerge";

export const defaultSeo: SeoProps = {
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
  target: SeoProps,
  ...sources: (SeoProps | undefined | false)[]
) =>
  sources.reduce<SeoProps>(
    (acc, current) =>
      deepmerge(acc, current || {}, {
        arrayMerge: (_target, source) => source,
      }),
    target,
  );

import Component from "./index.svelte";

export default Component;
