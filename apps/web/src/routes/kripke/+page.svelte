<script lang="ts">
import Katex from "$lib/components/katex.svelte";
import { type Formula, latexSymbols, prettyPrint } from "@cannorin/kripke";
import FormulaInput from "./formula-input.svelte";

let formula: Formula | undefined = $state(undefined);
let math = $derived.by(() => {
  if (formula) return prettyPrint(formula, { symbols: latexSymbols });
  return "\\phantom{p}";
});
</script>

<div class="flex flex-col min-h-screen items-center gap-12 lg:gap-16 py-8">
  <Katex math={math} />

  <FormulaInput bind:formula />
</div>
