<script lang="ts">
import { limitWidth } from "$lib/constants";
import { cn } from "$lib/utils";

import Card from "./card.svelte";
</script>

<!-- Sections -->
<main class={cn(limitWidth, "flex grow flex-col items-center gap-12 lg:gap-16 py-8")}>
  <h1 class="font-display text-4xl md:text-5xl lg:text-6xl">
    <a href="/">cannorin.net</a>
  </h1>

  <section class="flex flex-col items-center md:flex-row md:items-start gap-4 lg:gap-8">
    <h2 class="sr-only">自己紹介</h2>

    <Card more="back" />

    <section class="p-5 prose prose-sm prose-light">
      <p>
        何でも屋気味なフルスタックエンジニアです。
      </p>
      <p>
        実は<strong class="text-primary">コンパイラや開発ツール・フレームワーク自体の開発・修正が一番得意</strong>で、
        業務で使ってるツールの不具合の原因を特定して PR 送るとかを結構やります。
      </p>
      <p>
        コンピュータの理論面に関する一定の知識・理解もあります。
      </p>

      <h3 id="skills">スキルセット</h3>

      <p>業務経験のあるもののみを書いています。</p>

      <h4 class="text-primary font-bold">プログラム言語</h4>
      <ul>
        <li>TypeScript, C#, F#, OCaml</li>
        <li>いわゆる宣言的プログラミングを得意としています。とはいえ業務で一番書いているのは TypeScript です。</li>
        <li>静的型付きの言語ならだいたい全て対応できると思います。</li>
      </ul>

      <h4 class="text-primary font-bold">フロントエンド</h4>
      <ul>
        <li>Next.js, SvelteKit, Vite, Tailwind CSS</li>
        <li>いわゆる JAMstack アーキテクチャによるウェブサイト構築を得意としています。</li>
        <li>レスポンシブ対応は言わずもがな、Semantic HTML とかアクセシビリティにも結構こだわりがあります。</li>
      </ul>

      <h4 class="text-primary font-bold">バックエンド</h4>
      <ul>
        <li>.NET, Node.js, PostgreSQL, SQLite, Headless CMS, OpenAPI</li>
        <li>最近は JAMstack 側になるべく押し付けるようにしています。</li>
        <li>.NET の内部実装とか OpenAPI の仕様とか結構詳しいです。</li>
      </ul>

      <h4 class="text-primary font-bold">DevOps</h4>
      <ul>
        <li>Docker, Terraform, GitHub Actions, AWS, Cloudflare, Vercel</li>
        <li>DevOps 周りの整備はひととおりできます。</li>
        <li>最近は Cloudflare にお熱です。</li>
      </ul>

      <h3 id="works">つくったもの・関わったもの</h3>

      <ul>
        <li><a href="https://github.com/ocsigen/ts2ocaml" target="_blank">ts2ocaml</a>, <a href="https://github.com/CoreTweet/CoreTweet" target="_blank">CoreTweet</a> (作者)</li>
        <li><a href="https://github.com/fsprojects/FSharpPlus" target="_blank">FSharpPlus</a>, <a href="https://github.com/ionide/Ionide-vim" target="_blank">Ionide-vim</a> (メンテナ)</li>
        <li><a href="https://xn--pckjp4dudxftf.xn--tckwe/" target="_blank">ゴーストクラブ.コム</a>, <a href="https://www.0b4k3.com" target="_blank">0b4k3.com</a> (インフラ構築・実装)</li>
        <li>
          他にもコンパイラやパッケージマネージャに対するデカめの PR を通したことがあります (<a href="https://github.com/fable-compiler/Fable/pull/2618" target="_blank">fable-compiler/Fable#2618</a>,
            <a href="https://github.com/ocaml/opam/pull/5171" target="_blank">ocaml/opam#5171</a>,
            <a href="https://github.com/rescript-lang/rescript/pull/5364" target="_blank">rescript-lang/rescript#5364</a>, ...)
        </li>
      </ul>

      <a href="/" class="back mt-8 text-foreground no-underline font-normal">
        Back
      </a>
    </section>
  </section>
</main>

<style>
  .back {
    @apply flex md:hidden items-center justify-center rounded-full px-3 py-2;
    background: linear-gradient(45deg, rgb(var(--primary) / 50%), rgb(var(--secondary) / 50%));
  }
</style>
