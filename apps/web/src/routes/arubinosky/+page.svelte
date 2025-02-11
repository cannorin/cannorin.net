<script lang="ts">
import CharaSad from "$assets/images/static/arubinosky/arubinochan-scared.svg?component";
import Chara from "$assets/images/static/arubinosky/arubinochan.svg?component";
import Logo from "$assets/images/static/arubinosky/logo.svg?component";
import { limitWidth } from "$lib/constants";
import { cn } from "$lib/utils";
import Embed from "./embed.svelte";
import Terms from "./terms.md";

import Check from "lucide-svelte/icons/check";
import Copy from "lucide-svelte/icons/copy";

const getInviteCode = async () => {
  copied = false;
  const res = await fetch("/api/misskey/invite-code");
  if (res.ok)
    return {
      type: "ok" as const,
      code: await res.text(),
    };
  if (res.status === 429) return { type: "rate-limited" as const };
  if (res.status === 404) return { type: "closed" as const };
  return { type: "unknown-error" as const };
};

let invite = $state<Awaited<ReturnType<typeof getInviteCode>> | undefined>();
let copied = $state(false);
</script>

<main class={cn(limitWidth, "flex grow flex-col items-center gap-10 py-8")}>
  <h1>
    <a href="https://misskey.cannorin.net/" target="_blank">
      <Logo class="w-full h-auto" role="presentation" />
      <span class="sr-only">あるびのすきー</span>
    </a>
  </h1>

  <section id="about" class="prose !w-full !min-w-full sect">
    <h2>あるびのすきーとは？</h2>
    <p>
      あるびのすきーは「シンプル」と「かわいい」をテーマにした <a href="https://misskey-hub.net/ja/" target="_blank" rel="noopener noreferrer">Misskey</a> インスタンスです。
    </p>

    <ul>
      <li>UIがかわいい！ マスコットキャラもかわいい！</li>
      <li>与謝野晶子もレターパックもいません！（外部からは飛んでくるかも）</li>
      <li>好き勝手に話す bot がいます！ 話しかけてあげてね！</li>
    </ul>

    <Embed />

    ↓登録は利用規約を読んでから！↓
  </section>

  <section id="terms" class="prose !w-full !min-w-full sect">
    <Terms />
  </section>

  <section id="invite" class="sect flex flex-col-reverse md:flex-row gap-6 items-center justify-center">
    <div class="flex flex-col gap-4 items-center pb-6 md:pb-0">
      <h2 class="text-xl font-bold">招待コードを取得しよう！</h2>

      {#if !invite}
        <button
          class="border-2 rounded px-8 py-2 w-fit"
          onclick={async () => { invite = await getInviteCode() }}>
          今すぐ取得！
        </button>
      {:else if invite.type === "ok"}
        {@const code = invite.code}
        <div class="flex flex-col items-center gap-4">
          あなたの招待コードは
          <div class="flex flex-nowrap items-center justify-between h-8 gap-2 border-2 rounded px-2">
            <code>{code}</code>
            <button title="コピー" onclick={() => { navigator.clipboard.writeText(code); copied = true; }} class="text-xs">
              {#if copied}
                <Check size={18} aria-label="コピーしました" />
              {:else}
                <Copy size={18} aria-label="コピー" />
              {/if}
            </button>
          </div>
        </div>

        <a href="https://misskey.cannorin.net/" target="_blank" class="border-2 rounded px-8 py-2 w-fit">
          今すぐ登録！
        </a>
      {:else if invite.type === "rate-limited"}
        <div>
          <p>取得ボタンを押しすぎです。</p>
          <p>しばらく経ってからやり直してね</p>
        </div>
      {:else if invite.type === "closed"}
        <p>ごめんなさい、アカウントの枠がないようです。。</p>
      {:else if invite.type === "unknown-error"}
        <div>
          <p>謎のエラーが起こっています！！</p>
          <p>管理者までご連絡ください。。</p>
        </div>
      {/if}
    </div>

    {#if !invite || invite.type === "ok"}
      <Chara class="max-w-[400px]" />
    {:else}
      <CharaSad class="max-w-[400px]" />
    {/if}
  </section>
</main>

<style lang="postcss">
  .sect {
    @apply w-full rounded-xl p-6;
    background-color: white;
  }

</style>
