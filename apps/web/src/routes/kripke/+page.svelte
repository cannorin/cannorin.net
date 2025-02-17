<script lang="ts">
import Katex from "$lib/components/katex.svelte";
import {
  type Formula,
  type Frame,
  latexSymbols,
  prettyPrint,
} from "@cannorin/kripke";
import FormulaInput from "./formula-input.svelte";
import FrameInput from "./frame-input.svelte";

let formula: Formula | undefined = $state(undefined);
let frame: Frame = $state({ relations: new Set() });
let math = $derived.by(() => {
  if (formula) return prettyPrint(formula, { symbols: latexSymbols });
  return "\\phantom{p}";
});
</script>

<div class="flex flex-col min-h-screen max-w-full items-center gap-12 lg:gap-16 py-8">

  <h1 class="font-display text-6xl">KRiPkE</h1>

  <div class="w-[300px] flex flex-col gap-10">
    <div class="flex flex-col items-center gap-2">
      <Katex math={math} />
      <FormulaInput bind:formula />
    </div>

    <FrameInput bind:frame />
  </div>
</div>
