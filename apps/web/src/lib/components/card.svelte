<script lang="ts">
import { cn } from "$lib/utils";
import type { Snippet } from "svelte";
import type { Picture } from "vite-imagetools";

export interface CardProps {
  class?: string | undefined;
  image: Picture;
  title: Snippet;
  description: Snippet;
  links: Snippet;
  more?: "coming soon" | "back" | `/${string}` | undefined;
}

let { image, title, description, links, more, ...rest }: CardProps = $props();
</script>

<section class={cn("card", rest["class"])}>
  <enhanced:img
    src={image}
    sizes="min(400px, 100vw)"
    alt=""
    loading="eager"
    decoding="async" />
  <div class="body">
    <h3>{@render title()}</h3>
    <div>
      {@render description()}
    </div>
    <nav>
      <ul class="links">
        {@render links()}
        {#if more === "coming soon"}
          <li class="more">
            <button disabled class="tooltip cursor-not-allowed">
              <span class="tooltip-text">coming soon™</span>
              More
            </button>
          </li>
        {:else if more === "back"}
          <li class="more">
            <a href="/">
              Back
            </a>
          </li>
        {:else if !!more}
          <li class="more">
            <a href={more}>
              More
            </a>
          </li>
        {/if}
      </ul>
    </nav>
  </div>
</section>

<style lang="postcss">
  .card {
    @apply relative max-w-[400px] md:w-[240px] xl:w-[360px] rounded-2xl flex flex-col items-center shadow overflow-clip;

    &::before {
      @apply absolute top-0 left-0 right-0 bottom-0 rounded-2xl border border-transparent;
      z-index: -1;
      content: "";
      background: linear-gradient(transparent, rgb(var(--foreground) / 10%), rgb(var(--foreground) / 20%), rgb(var(--foreground) / 100%)) border-box border-box;
      mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0) border-box;
      mask-composite: exclude;
    }

    picture {
      @apply w-full;
      mask: linear-gradient(rgb(0 0 0 / 100%), rgb(0 0 0 / 90%), rgb(0 0 0 / 80%), transparent);

      img {
        @apply aspect-video md:aspect-square object-cover;
      }
    }

    .body {
      @apply h-full p-5 flex flex-col gap-4;

      h3 {
        @apply text-2xl font-display;
      }

      > :last-child {
        margin-top: auto;
      }

      .links {
        @apply flex flex-wrap items-center gap-4 text-sm h-7;
        .more {
          @apply flex items-center ml-auto rounded-full;
          background: linear-gradient(45deg, rgb(var(--primary) / 50%), rgb(var(--secondary) / 50%));
          > * {
            @apply px-3 py-1;
          }
        }
      }
    }
  }

  /* カーソルを重ねる要素 */
  .tooltip {
    position: relative; /* ツールチップの位置の基準に */
  }

  /* ツールチップのテキスト */
  .tooltip-text {
    opacity: 0; /* はじめは隠しておく */
    visibility: hidden; /* はじめは隠しておく */
    position: absolute; /* 絶対配置 */
    left: 50%; /* 親に対して中央配置 */
    transform: translateX(-50%); /* 親に対して中央配置 */
    bottom: 34px; /* 親要素下からの位置 */
    display: inline-block;
    padding: 5px; /* 余白 */
    white-space: nowrap; /* テキストを折り返さない */
    font-size: 0.8rem; /* フォントサイズ */
    line-height: 1.3; /* 行間 */
    background: rgb(var(--foreground) / 1); /* 背景色 */
    color: rgb(var(--background) / 1); /* 文字色 */
    border-radius: 8px; /* 角丸 */
    transition: 0.3s ease-in; /* アニメーション */
    display: flex;
    align-items: center;
    justify-content: center;

    &:before {
      content: '';
      position: absolute;
      top: 25px;
      left: 50%;
      margin-left: -7px;
      border: 7px solid transparent;
      border-top: 7px solid rgb(var(--foreground) / 1);
    }
  }

  /* ホバー時にツールチップの非表示を解除 */
  .tooltip:hover .tooltip-text {
    opacity: 1;
    visibility: visible;
  }
</style>
