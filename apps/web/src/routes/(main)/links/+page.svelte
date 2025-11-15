<script lang="ts">
import type { Snippet } from "svelte";
import { limitWidth } from "$lib/constants";
import { cn } from "$lib/utils";

const categories = [
  { type: "mine" },
  { type: "friend", text: "友人のサイト" },
  { type: "favorite", text: "お気に入り" },
] as const;

const sites: {
  href: string;
  name: string;
  type: (typeof categories)[number]["type"];
  description?: string | Snippet;
}[] = [
  {
    href: "https://zkillboard.com/character/96980978/",
    name: "zKillboard",
    type: "mine",
    description: zkillboard,
  },
  {
    href: "https://cannorin.fanbox.cc/",
    name: "pixiv FANBOX",
    type: "mine",
    description:
      "5年ほど前に、ここで日記を書いていた時期がありました。気軽な投げ銭用として残してあります。",
  },
  {
    href: "https://note.com/cannorin",
    name: "note",
    type: "mine",
    description:
      "音楽関係・VRChat関係の書き物を置こうかと思って作りましたが、今後はこっちのサイトでやりそうです。",
  },
  {
    href: "https://speakerdeck.com/cannorin",
    name: "Speaker Deck",
    type: "mine",
    description:
      "昔作ったスライドがいくつか置いてあります。今後はこっちのサイトに置くと思います。",
  },

  {
    href: "https://tohlpeaks.party/",
    name: "FATAL WOVND",
    type: "friend",
  },
  {
    href: "https://sno2wman.net/",
    name: "SnO2WMaN.net",
    type: "friend",
  },

  {
    href: "https://www.umsu.de/trees/",
    name: "Tree Proof Generator",
    type: "favorite",
    description:
      "古典命題論理・古典述語論理・一部の正規様相論理について、論理式の証明もしくは反例モデルを出してくれるサイトです。",
  },
  {
    href: "https://hferee.github.io/UIML/demo.html",
    name: "Uniform interpolant calculator",
    type: "favorite",
    description:
      "直観主義命題論理と一部の様相論理（チョイスが謎すぎる）上で、論理式の一様補間を計算してくれるサイトです。",
  },
  {
    href: "http://forkinganddividing.com/",
    name: "Map of the Universe",
    type: "favorite",
    description:
      "モデル理論の道具 (forking and dividing) でいろんな理論を見た図が描かれてるサイトです。",
  },
  {
    href: "https://sharplab.io/",
    name: "SharpLab",
    type: "favorite",
    description:
      "C# や F# などの .NET 言語でコードを書いて、その逆アセンブル結果を見られるサイトです。",
  },
];
</script>

{#snippet zkillboard()}
  <a href="https://www.eveonline.com/" target="_blank" rel="noopener noreferrer">EVE Online</a> をやっていた頃の私のキルボード（戦績表）です。
  もう忙しくて全然遊べていない……
{/snippet}

<main class={cn(limitWidth, "flex flex-col items-center gap-6 lg:gap-8")}>
  <h1 class="sr-only">Links</h1>

  <section class="w-full !max-w-[720px] prose prose-sm prose-light">
    <h2 class="text-xl">コンテンツ</h2>

    <p>ブラウザで遊べる自作ゲームと、ブラウザで使える自作ツールを置いています。</p>

    <nav>
      <ul>
        <li>
          <a href="/kripke" >The Kripke Game</a>
          <div class="text-xs">
            論理式を使って <a href="https://ja.wikipedia.org/wiki/%E3%82%AF%E3%83%AA%E3%83%97%E3%82%AD%E6%84%8F%E5%91%B3%E8%AB%96" target="_blank" rel="noopener noreferrer">クリプキフレーム</a> の形状を推測する Wordle 風ゲームです。
          </div>
        </li>
      </ul>
      <ul>
        <li>
          <a href="https://7colou.red/UdonExternSearch2/" target="_blank" rel="noopener noreferrer">Udon Extern Search 2</a>
          <div class="text-xs">
            VRChat のスクリプト基盤 Udon で使える関数を検索できます。
          </div>
        </li>
      </ul>
    </nav>
  </section>

  <section class="w-full !max-w-[720px] prose prose-sm prose-light">
    <h2 class="text-xl">その他のリンク</h2>

    <p>他のページで紹介していない各種アカウント・ページを載せています。</p>

    <nav>
      <ul class="space-y-2">
        {#each sites.filter((s) => s.type === "mine") as site}
          <li>
            <a href={site.href} target="_blank" rel="noopener noreferrer">{site.name}</a>
            {#if site.description}
              <div class="text-xs">
                {#if typeof site.description === "string"}
                  {site.description}
                {:else}
                  {@render site.description()}
                {/if}
              </div>
            {/if}
          </li>
        {/each}
      </ul>
    </nav>
  </section>

  <section class="w-full !max-w-[720px] prose prose-sm prose-light">
    <h2 class="text-xl">おすすめのサイト</h2>

    <p>私の友人のウェブサイトや、個人的に気に入っているウェブサイトを紹介しています。</p>

    {#each categories as category}
      {#if category.type !== "mine" && sites.filter((s) => s.type === category.type).length > 0}
        <nav>
          <h3 class="text-base font-bold text-primary">{category.text}</h3>
          <ul class="space-y-2">
            {#each sites.filter((s) => s.type === category.type) as site}
              <li>
                <div class="flex flex-wrap items-center gap-x-1">
                  <a href={site.href} target="_blank" rel="noopener noreferrer">{site.name}</a>
                  {#if !site.description}
                    <span class="text-xs text-muted">({new URL(site.href).hostname})</span>
                  {/if}
                </div>
                {#if site.description}
                  <div class="text-xs">
                    {#if typeof site.description === "string"}
                      {site.description}
                    {:else}
                      {@render site.description()}
                    {/if}
                  </div>
                {/if}
              </li>
            {/each}
          </ul>
        </nav>
      {/if}
    {/each}
  </section>

  <aside class="w-full !max-w-[720px] prose prose-sm">
    <p>何かありましたら下記までご連絡ください。相互リンクも募集中です！（ウェブサイトとブログのみ受け付けています。SNSのプロフィールページは受け付けていないのであしからず……）</p>
    <nav>
      <ul class="not-prose text-primary underline font-medium flex flex-wrap gap-x-4">
        <li>
          <a href="https://keybase.io/cannorin" target="_blank" rel="noopener noreferrer">
            KeyBase
          </a>
        </li>
        <li>
          <a href="https://x.com/cannorin3" target="_blank" rel="noopener noreferrer">
            X (Twitter)
          </a>
        </li>
        <li>
          <a href="https://misskey.cannorin.net/@cannorin" target="_blank" rel="noopener noreferrer">
            Misskey
          </a>
        </li>
        <li>
          <a href="https://discord.com/users/497190979216867329" target="_blank" rel="noopener noreferrer">
            Discord
          </a>
        </li>
        <li>
          <a href="mailto:contact@cannorin.net">contact@cannorin.net</a>
        </li>
      </ul>
    </nav>
  </aside>
</main>
