<script lang="ts">
import Katex from "$lib/components/katex.svelte";
import {
  type Formula,
  type Frame,
  latexSymbols,
  prettyPrint,
} from "@cannorin/kripke";
import LuHeart from "lucide-svelte/icons/heart";
import LuHeartCrack from "lucide-svelte/icons/heart-crack";
import FormulaInput from "./formula-input.svelte";
import FrameInput from "./frame-input.svelte";

let formula: Formula | undefined = $state(undefined);
let frame: Frame = $state({ relations: new Set() });
let math = $derived.by(() => {
  if (formula) return prettyPrint(formula, { symbols: latexSymbols });
  return "\\phantom{p}";
});

const life = 6;
</script>

<main class="flex flex-col min-h-screen max-w-full items-center gap-12 lg:gap-16 py-8">

  <h1 class="font-display text-6xl">KRiPkE</h1>

  <div class="flex flex-col md:flex-row-reverse gap-x-20 gap-y-8">
    <div class="w-[300px] flex flex-col gap-4">
      <div class="flex items-center justify-between">
        {#each [1,2,3,4,5,6,7,8,9,10] as i}
          {#if i <= life}
            <LuHeart class="text-primary" />
          {:else}
            <LuHeartCrack class="text-muted" />
          {/if}
        {/each}
      </div>

      <div class="flex flex-col items-center gap-2">
        <FrameInput bind:frame />

        <button class="rounded w-full p-1 text-background bg-primary font-bold flex items-center justify-center gap-2">
          Guess! <span class="flex items-center font-normal">(<LuHeart size=14 class="mt-1"/>1)</span>
        </button>
      </div>

      <div class="flex flex-col items-center gap-2">
        <Katex math={math} />
        <FormulaInput bind:formula />
        <button class="rounded w-full p-1 text-background bg-primary font-bold flex items-center justify-center gap-2">
          Check! <span class="flex items-center font-normal">(<LuHeart size=14 class="mt-1"/>1)</span>
        </button>
      </div>
    </div>

    <div class="w-[300px] flex flex-col gap-4">
      Foo
    </div>
  </div>
</main>
