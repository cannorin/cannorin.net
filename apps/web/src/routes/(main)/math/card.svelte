<script lang="ts">
import SiOrcid from "@icons-pack/svelte-simple-icons/icons/SiOrcid";
import SiResearchgate from "@icons-pack/svelte-simple-icons/icons/SiResearchgate";

import IconLogic from "$assets/images/static/icon/logic-chang.webp?w=1080;800;600;400;300&enhanced";
import Card, { type CardProps } from "$components/card.svelte";
import { cn } from "$lib/utils";

let { more, ...rest }: Pick<CardProps, "more" | "class"> = $props();
</script>

<Card image={IconLogic} more={more} class={cn("[view-transition-name:card-math]", rest["class"])}>
  {#snippet title()}
    Graduate Student
  {/snippet}

  {#snippet description()}
    大学院において数理論理学を研究しており、非古典論理、特に様相論理を専門としています。2025年度より博士課程に在学中です。
  {/snippet}

  {#snippet links()}
    <li>
      <a href="https://orcid.org/0009-0009-3946-4260" target="_blank" rel="noopener noreferrer">
        <SiOrcid title="ORCiD" />
      </a>
    </li>
    <li>
      <a href="https://www.researchgate.net/profile/Yuta-Sato-22" target="_blank" rel="noopener noreferrer">
        <SiResearchgate title="ResearchGate" />
      </a>
    </li>
  {/snippet}
</Card>
