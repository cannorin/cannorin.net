<script lang="ts">
import Card, { type CardProps } from "$components/card.svelte";
import { cn } from "$lib/utils";

import IconTapl from "$assets/images/static/icon/tapl.webp?w=1080;800;600;400;300&enhanced";

import SiGithub from "@icons-pack/svelte-simple-icons/icons/SiGithub";
import SiQiita from "@icons-pack/svelte-simple-icons/icons/SiQiita";
import SiZenn from "@icons-pack/svelte-simple-icons/icons/SiZenn";

let { more, ...rest }: Pick<CardProps, "more" | "class"> = $props();
</script>

<Card image={IconTapl} more={more} class={cn("[view-transition-name:card-dev]", rest["class"])}>
  {#snippet title()}
    Developer
  {/snippet}

  {#snippet description()}
    フルスタックエンジニアとして働いており、いくつかの OSS に関わっています。また、趣味で Web サービスを運用しています。
  {/snippet}

  {#snippet links()}
    <li>
      <a href="https://github.com/cannorin" target="_blank" rel="noopener noreferrer">
        <SiGithub title="GitHub" />
      </a>
    </li>
    <li>
      <a href="https://qiita.com/cannorin" target="_blank" rel="noopener noreferrer">
        <SiQiita title="Qiita" />
      </a>
    </li>
    <li>
      <a href="https://zenn.dev/cannorin" target="_blank" rel="noopener noreferrer">
        <SiZenn title="Zenn" />
      </a>
    </li>
  {/snippet}
</Card>
