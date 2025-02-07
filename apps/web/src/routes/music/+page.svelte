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
      <p>ブレイクビーツと高速四つ打ちがメインです。以下のような雰囲気の DJ が得意です。</p>

      <ul>
        <li><em>Atmospheric:</em> DnB, Jungle, Trance, IDM, ...</li>
        <li><em>Aggressive:</em> Crossbreed, Breakcore, Speedcore, ...</li>
        <li><em>Industrial:</em> Frenchcore, Schranz, Doomcore, ...</li>
        <li><em>Peak-time Hardcore:</em> Hardstyle, J-Core, Uptempo, ...</li>
      </ul>

      <p>作る曲もだいたいこのへんのジャンルです。</p>

      <h3 id="affiliation">主宰・所属</h3>

      <ul>
        <li>
          The Underground (VRChat, 主宰)
        </li>
        <li><a href="https://%E3%82%B4%E3%83%BC%E3%82%B9%E3%83%88%E3%82%AF%E3%83%A9%E3%83%96.%E3%82%B3%E3%83%A0/">GHOSTCLUB</a> (VRChat, レジデント)</li>
        <li>system crash (石橋 Bhanc, レジデント)</li>
        <li>戡殺硬核領域 -Kansai HARDCORE Field- (石橋 Bhanc, レジデント)</li>
      </ul>

      <h3 id="guest-appearances">ゲスト出演歴</h3>

      <ul>
        <li>
          <a href="https://v-fes.sanrio.co.jp/">SANRIO Virtual Festival in Sanrio Puroland</a> (VRChat)
          <ul>
            <li>Vfes 2024 Summer Edition, ALT3</li>
            <li>Vfes 2024, ALT3 RED</li>
            <li>Vfes 2023, ALT3 RED/BLUE</li>
            <li>Vfes (2021), ALT3 RED/BLUE</li>
          </ul>
        </li>
        <li>
          <a href="https://oooto.otherman-records.com/4/" target="_blank">大音4</a> (中野 ヘビーシックゼロ)
          <ul>
            <li>サブフロアのキュレーションも担当しました。</li>
          </ul>
        </li>
        <li><a href="https://x.com/cannorin3/status/1800402487771549782" target="_blank">4KICKS FOR GEEKS #4</a> (心斎橋 夜来香)</li>
        <li><a href="https://x.com/cannorin3/status/1655598762822365189" target="_blank">embodiment</a> (心斎橋 夜来香)</li>
        <li><a href="https://x.com/tohlpeaks/status/1570381932365434880" target="_blank">miracle☆sugar - sato♡shin &amp; TohLPeaks Release Party</a> (難波 ベアーズ)</li>
        <li>
          and more...
          <ul>
            <li>関西圏とVRのパーティーを中心に、年間約30回ほど DJ 出演しています。</li>
          </ul>
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
