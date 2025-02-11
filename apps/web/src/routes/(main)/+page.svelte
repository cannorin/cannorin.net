<script lang="ts">
import { limitWidth } from "$lib/constants";
import { cn } from "$lib/utils";
import type { Snapshot } from "../$types";
import CardDev from "./dev/card.svelte";
import CardMath from "./math/card.svelte";
import CardMusic from "./music/card.svelte";

import SiDiscord from "@icons-pack/svelte-simple-icons/icons/SiDiscord";
import SiKeybase from "@icons-pack/svelte-simple-icons/icons/SiKeybase";
import SiMisskey from "@icons-pack/svelte-simple-icons/icons/SiMisskey";
import SiSteam from "@icons-pack/svelte-simple-icons/icons/SiSteam";
import SiTwitch from "@icons-pack/svelte-simple-icons/icons/SiTwitch";
import SiX from "@icons-pack/svelte-simple-icons/icons/SiX";

type SnapshotData = {
  scrollPosition: number;
};

export const snapshot: Snapshot<SnapshotData> = {
  capture: () => ({
    scrollPosition: window.scrollY,
  }),
  restore: (value) => {
    setTimeout(() => {
      window.scroll(0, value.scrollPosition);
    }, 0);
  },
};
</script>

<!-- Sections -->
<main class={cn(limitWidth, "flex flex-col items-center gap-12 lg:gap-16")}>
  <section class="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-8">
    <h2 class="sr-only">自己紹介</h2>

    <CardMusic more="/music" />

    <CardDev more="/dev" />

    <CardMath more="coming soon" />
  </section>

  <section class="followme">
    <h2 class="font-display text-2xl">Follow me on:</h2>
    <nav>
      <ul class="flex flex-row flex-nowrap items-center gap-4 text-sm">
        <li>
          <a href="https://keybase.io/cannorin" target="_blank" rel="noopener noreferrer">
            <SiKeybase title="Keybase" />
          </a>
        </li>
        <li>
          <a href="https://x.com/cannorin3" target="_blank" rel="noopener noreferrer">
            <SiX title="X (Twitter)" />
          </a>
        </li>
        <li>
          <a href="https://misskey.cannorin.net/@cannorin" target="_blank" rel="noopener noreferrer">
            <SiMisskey title="Misskey" />
          </a>
        </li>
        <li>
          <a href="https://www.twitch.tv/cannorin" target="_blank" rel="noopener noreferrer">
            <SiTwitch title="Twitch" />
          </a>
        </li>
        <li>
          <a href="https://discord.com/users/497190979216867329" target="_blank" rel="noopener noreferrer">
            <SiDiscord title="Discord" />
          </a>
        </li>
        <li>
          <a href="https://steamcommunity.com/id/cannorin/" target="_blank" rel="noopener noreferrer">
            <SiSteam title="Steam" />
          </a>
        </li>
      </ul>
    </nav>
  </section>
</main>

<style lang="postcss">
  .followme {
    @apply flex flex-row flex-wrap items-center justify-center gap-4 px-10 py-4 rounded-full;
    background: linear-gradient(45deg, rgb(var(--primary) / 50%), rgb(var(--secondary) / 50%));
  }
</style>
