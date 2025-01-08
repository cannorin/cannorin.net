import type { SeoProps } from "$components/seo";

export async function load() {
  return {
    seo: {
      title: "あるびのすきー",
      description: "とにかくかわいい Misskey インスタンス",
      openGraph: {
        title: "あるびのすきー",
        description: "とにかくかわいい Misskey インスタンス",
      },
      twitter: {
        title: "あるびのすきー",
        description: "とにかくかわいい Misskey インスタンス",
      },
    } as SeoProps,
  };
}
