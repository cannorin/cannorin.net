<script lang="ts">
import Card, { type CardProps } from "$components/card.svelte";

import IconTapl from "$assets/images/static/icon/tapl.webp?w=1080;800;600;400;300&enhanced";

import SiGithub from "@icons-pack/svelte-simple-icons/icons/SiGithub";
import SiQiita from "@icons-pack/svelte-simple-icons/icons/SiQiita";
import SiZenn from "@icons-pack/svelte-simple-icons/icons/SiZenn";

let { more }: Pick<CardProps, "more"> = $props();
</script>

<Card image={IconTapl} more={more} class="[view-transition-name:card-dev]">
  {#snippet title()}
    Developer
  {/snippet}

  {#snippet description()}
    フルスタックエンジニアとして働いており、いくつかの OSS に関わっています。また、趣味で Web サービスを運用しています。
  {/snippet}

  {#snippet links()}
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
  {/snippet}
</Card>
