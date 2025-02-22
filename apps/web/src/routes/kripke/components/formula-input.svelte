<script lang="ts">
import { type Formula, prettyPrint, tryParse } from "@cannorin/kripke";
import { formulaHistory } from "../lib/store";

let {
  formula = $bindable<Formula | undefined>(undefined),
  disabled = false,
}: {
  formula?: Formula | undefined;
  disabled?: boolean | undefined;
} = $props();

let input = $state(formula ? prettyPrint(formula) : "");
let error = $state(false);
let history = $derived(
  [...$formulaHistory]
    .toSorted(([_a, ac], [_b, bc]) => bc - ac)
    .slice(0, 10)
    .map(([a, _ac]) => a),
);

$effect(() => {
  const fml = tryParse(input);
  if (fml) {
    formula = fml;
    error = false;
  } else {
    formula = undefined;
    error = input !== null && input.length > 0;
  }
});
</script>

{#if history.length > 0}
  <datalist id="formula-history">
    {#each history as fml}
      <option value={fml}></option>
    {/each}
  </datalist>
{/if}

<input
  id="formula"
  list="formula-history"
  class={["rounded border border-foreground ring-0 focus:outline-none focus:ring-0 p-2 w-full", error && "border-primary"]}
  type="text"
  placeholder="Enter modal formula"
  disabled={disabled}
  bind:value={input} />
