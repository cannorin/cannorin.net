<script lang="ts">
import { limitWidth } from "$lib/constants";
import { cn } from "$lib/utils";

import Card from "./card.svelte";
</script>

<!-- Sections -->
<main class={cn(limitWidth, "flex grow flex-col items-center gap-12 lg:gap-16")}>
  <section class="flex flex-col items-center md:flex-row md:items-start gap-4 lg:gap-8">
    <h2 class="sr-only">自己紹介</h2>

    <Card class="md:!sticky md:top-16" more="back" />

    <section class="p-5 prose prose-sm prose-light">
      <p>ブレイクビーツと高速四つ打ちを中心に、統一感と説得力のあるマルチジャンルプレイをする DJ です。</p>
      <p>以下のような雰囲気の DJ が得意です。</p>

      <ul>
        <li>
          <strong class="text-primary">Atmospheric</strong>
          <ul>
            <li>Drum & Bass, Jungle, Trance, Techno, IDM, ...</li>
            <li>ワイヤードな世界観で緻密にミックスします。</li>
          </ul>
        </li>
        <li>
          <strong class="text-primary">Aggressive</strong>
          <ul>
            <li>Crossbreed, Neurofunk, Breakcore, Speedcore, ...</li>
            <li>鬱屈とした心から湧き上がる冷たい衝動をぶつけます。</li>
          </ul>
        </li>
        <li>
          <strong class="text-primary">Peak-time Hardcore</strong>
          <ul>
            <li>Frenchcore, Rawstyle, J-Core, Uptempo Hardcore, ...</li>
            <li>私のハードコアは "予習" 無しで楽しめます。</li>
          </ul>
        </li>
      </ul>

      <p>作る曲もだいたいこのへんのジャンルです。</p>

      <h3 id="gears">使用機材・ソフトウェア</h3>

      <p>普段の DJ の際は、以下の機材を持ち込んでいます。あまりサイズは取りませんが、ブースに置くスペースがあるとうれしいです。なお、CDJ + USB のオーソドックスなプレイもできます。</p>

      <ul>
        <li><a href="https://www.allen-heath.com/hardware/xone-series/xonek2/" target="_blank" rel="noopener noreferrer">Allen & Heath Xone:K2</a> (4ch MIDI コントローラ)</li>
        <li><a href="https://evo.audio/products/audio-interfaces/evo-4/overview/" target="_blank" rel="noopener noreferrer"> Audient EVO 4</a> (AIF, フォンから RCA に変換)</li>
        <li><a href="https://mixxx.org/" target="_blank" rel="noopener noreferrer">Mixxx</a> (DJ ソフトウェア)</li>
        <li><a href="https://www.audio-technica.co.jp/product/ATH-M50x" target="_blank" rel="noopener noreferrer">audio-technica ATH-M50x</a></li>
        <li>オヤイデ d+ classB RCA ケーブル</li>
        <li>ノートPC</li>
      </ul>

      <p>作曲には Ableton Live を使用しています。</p>

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
          <a href="https://oooto.otherman-records.com/4/" target="_blank" rel="noopener noreferrer">大音4</a> (中野 ヘビーシックゼロ)
          <ul>
            <li>サブフロアのキュレーションも担当しました。</li>
          </ul>
        </li>
        <li><a href="https://x.com/cannorin3/status/1800402487771549782" target="_blank" rel="noopener noreferrer">4KICKS FOR GEEKS #4</a> (心斎橋 夜来香)</li>
        <li><a href="https://x.com/cannorin3/status/1655598762822365189" target="_blank" rel="noopener noreferrer">embodiment</a> (心斎橋 夜来香)</li>
        <li><a href="https://x.com/tohlpeaks/status/1570381932365434880" target="_blank" rel="noopener noreferrer">miracle☆sugar - sato♡shin &amp; TohLPeaks Release Party</a> (難波 ベアーズ)</li>
        <li>
          and more...
          <ul>
            <li>関西圏とVRのパーティーを中心に、年間約30回ほど DJ 出演しています。</li>
          </ul>
        </li>
      </ul>

      <h3 id="contact">連絡先</h3>

      <p>
        ブッキングや音楽制作などのご連絡は
        <a href="https://discord.com/users/497190979216867329" target="_blank" rel="noopener noreferrer">Discord</a>,
        <a href="https://x.com/cannorin3" target="_blank" rel="noopener noreferrer">Twitter (X)</a>,
        または <a href="mailto:contact@cannorin.net">contact@cannorin.net</a> までお願いします。
      </p>

      <a href="/" class="back mt-8 text-foreground no-underline font-normal">
        Back
      </a>
    </section>
  </section>
</main>

<style lang="postcss">
  .back {
    @apply flex md:hidden items-center justify-center rounded-full px-3 py-2;
    background: linear-gradient(45deg, rgb(var(--primary) / 50%), rgb(var(--secondary) / 50%));
  }
</style>
