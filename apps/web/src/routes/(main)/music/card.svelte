<script lang="ts">
import Card, { type CardProps } from "$components/card.svelte";
import { cn } from "$lib/utils";

import IconJakeko from "$assets/images/static/icon/jakeko.webp?w=1080;800;600;400;300&enhanced";

import SiBandcamp from "@icons-pack/svelte-simple-icons/icons/SiBandcamp";
import SiMixcloud from "@icons-pack/svelte-simple-icons/icons/SiMixcloud";
import SiSoundcloud from "@icons-pack/svelte-simple-icons/icons/SiSoundcloud";

let { more, ...rest }: Pick<CardProps, "more" | "class"> = $props();
</script>

<Card image={IconJakeko} more={more} class={cn("[view-transition-name:card-music]", rest["class"])}>
  {#snippet title()}
    DJ / Composer
  {/snippet}

  {#snippet description()}
    ワイヤードでは VRChat を拠点に、リアルワールドでは大阪を拠点にして、DJ や作曲などの音楽活動を行っています。
  {/snippet}

  {#snippet links()}
    <li>
      <a href="https://cannorin.bandcamp.com/" target="_blank" rel="noopener noreferrer">
        <SiBandcamp title="Bandcamp" />
      </a>
    </li>
    <li>
      <a href="https://soundcloud.com/cannorin" target="_blank" rel="noopener noreferrer">
        <SiSoundcloud title="Soundcloud" />
      </a>
    </li>
    <li>
      <a href="https://mixcloud.com/cannorin" target="_blank" rel="noopener noreferrer">
        <SiMixcloud title="Mixcloud" />
      </a>
    </li>
  {/snippet}
</Card>
