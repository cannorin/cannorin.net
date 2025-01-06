<script lang="ts">
import { limitWidth } from "$lib/constants";
import { cn } from "$lib/utils";

import SiBandcamp from "@icons-pack/svelte-simple-icons/icons/SiBandcamp";
import SiDiscord from "@icons-pack/svelte-simple-icons/icons/SiDiscord";
import SiGithub from "@icons-pack/svelte-simple-icons/icons/SiGithub";
import SiKeybase from "@icons-pack/svelte-simple-icons/icons/SiKeybase";
import SiMisskey from "@icons-pack/svelte-simple-icons/icons/SiMisskey";
import SiMixcloud from "@icons-pack/svelte-simple-icons/icons/SiMixcloud";
import SiOrcid from "@icons-pack/svelte-simple-icons/icons/SiOrcid";
import SiQiita from "@icons-pack/svelte-simple-icons/icons/SiQiita";
import SiResearchgate from "@icons-pack/svelte-simple-icons/icons/SiResearchgate";
import SiSoundcloud from "@icons-pack/svelte-simple-icons/icons/SiSoundcloud";
import SiSteam from "@icons-pack/svelte-simple-icons/icons/SiSteam";
import SiTwitch from "@icons-pack/svelte-simple-icons/icons/SiTwitch";
import SiX from "@icons-pack/svelte-simple-icons/icons/SiX";
import SiZenn from "@icons-pack/svelte-simple-icons/icons/SiZenn";
</script>

<!-- Sections -->
<main class={cn(limitWidth, "flex grow flex-col items-center gap-12 lg:gap-16 py-8")}>
  <h1 class="font-display text-4xl md:text-5xl lg:text-6xl">cannorin.net</h1>

  <section class="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-8">
    <h2 class="sr-only">自己紹介</h2>

    <section class="card">
      <enhanced:img
        src="../assets/images/static/icon/jakeko.webp?w=1080;800;600;400;300"
        sizes="min(400px, 100vw)"
        alt=""
        loading="eager"
        decoding="async"
        class="animate-fade-in" />
      <div class="body">
        <h3>DJ / Composer</h3>
        <p>ワイヤードでは VRChat を拠点に、リアルワールドでは大阪を拠点にして、DJ や作曲などの音楽活動を行っています。</p>
        <nav>
          <ul class="links">
            <li>
              <a href="https://cannorin.bandcamp.com/" target="_blank">
                <SiBandcamp title="Bandcamp" />
              </a>
            </li>
            <li>
              <a href="https://soundcloud.com/cannorin" target="_blank">
                <SiSoundcloud title="Soundcloud" />
              </a>
            </li>
            <li>
              <a href="https://mixcloud.com/cannorin" target="_blank">
                <SiMixcloud title="Mixcloud" />
              </a>
            </li>
            <li class="more">
              <button disabled class="tooltip cursor-not-allowed">
                <span class="tooltip-text">coming soon™</span>
                More
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </section>

    <section class="card">
      <enhanced:img
        src="../assets/images/static/icon/tapl.webp?w=1080;800;600;400;300"
        sizes="min(400px, 100vw)"
        alt=""
        loading="eager"
        decoding="async"
        class="animate-fade-in" />
      <div class="body">
        <h3>Developer</h3>
        <p>フルスタックエンジニアとして働いており、いくつかの OSS に関わっています。また、趣味で Web サービスを運用しています。</p>
        <nav>
          <ul class="links w-full">
            <li>
              <a href="https://github.com/cannorin" target="_blank">
                <SiGithub title="GitHub" />
              </a>
            </li>
            <li>
              <a href="https://qiita.com/cannorin" target="_blank">
                <SiQiita title="Qiita" />
              </a>
            </li>
            <li>
              <a href="https://zenn.dev/cannorin" target="_blank">
                <SiZenn title="Zenn" />
              </a>
            </li>
            <li class="more">
              <button disabled class="tooltip cursor-not-allowed">
                <span class="tooltip-text">coming soon™</span>
                More
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </section>

    <section class="card">
      <enhanced:img
        src="../assets/images/static/icon/logic-chang.webp?w=1080;800;600;400;300"
        sizes="min(400px, 100vw)"
        alt=""
        loading="eager"
        decoding="async"
        class="animate-fade-in" />
      <div class="body">
        <h3>Graduate Student</h3>
        <p>大学院において数理論理学を研究しており、非古典論理、特に様相論理を専門としています。2025年度より博士課程に進学します。</p>
        <nav>
          <ul class="links">
            <li>
              <a href="https://orcid.org/0009-0009-3946-4260" target="_blank">
                <SiOrcid title="ORCiD" />
              </a>
            </li>
            <li>
              <a href="https://www.researchgate.net/profile/Yuta-Sato-22" target="_blank">
                <SiResearchgate title="ResearchGate" />
              </a>
            </li>
            <li class="more">
              <button disabled class="tooltip cursor-not-allowed">
                <span class="tooltip-text">coming soon™</span>
                More
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </section>
  </section>

  <section class="followme">
    <h2 class="font-display text-2xl">Follow me on:</h2>
    <nav>
      <ul class="flex flex-row flex-nowrap items-center gap-4 text-sm">
        <li>
          <a href="https://keybase.io/cannorin" target="_blank">
            <SiKeybase title="Keybase" />
          </a>
        </li>
        <li>
          <a href="https://x.com/cannorin3" target="_blank">
            <SiX title="X (Twitter)" />
          </a>
        </li>
        <li>
          <a href="https://misskey.cannorin.net/@cannorin" target="_blank">
            <SiMisskey title="Misskey" />
          </a>
        </li>
        <li>
          <a href="https://www.twitch.tv/cannorin" target="_blank">
            <SiTwitch title="Twitch" />
          </a>
        </li>
        <li>
          <a href="https://discord.com/users/497190979216867329" target="_blank">
            <SiDiscord title="Discord" />
          </a>
        </li>
        <li>
          <a href="https://steamcommunity.com/id/cannorin/" target="_blank">
            <SiSteam title="Steam" />
          </a>
        </li>
      </ul>
    </nav>
  </section>
</main>

<style lang="postcss">
  .card {
    @apply relative max-w-[400px] rounded-2xl flex flex-col items-center shadow overflow-clip;

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
        @apply flex flex-wrap items-center gap-4 text-sm;
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

  .followme {
    @apply flex flex-row flex-wrap items-center justify-center gap-4 px-10 py-4 rounded-full;
    background: linear-gradient(45deg, rgb(var(--primary) / 50%), rgb(var(--secondary) / 50%));
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
