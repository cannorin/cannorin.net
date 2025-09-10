<script lang="ts">
import Katex from "$lib/components/katex.svelte";
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
let inputElement: HTMLInputElement;

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

{#snippet mathKey(latexCommand: string, actualText?: string)}
  <button type="button" onclick={(e) => {
    e.preventDefault();
    input += actualText ?? latexCommand;
    inputElement.focus();
  }}>
    <Katex math={latexCommand} />
  </button>
{/snippet}

<div class="rounded border border-foreground w-full">
  <div class="border-0 border-b border-muted px-2 py-1 flex justify-between">
    {@render mathKey("\\top", "⊤")}
    {@render mathKey("\\bot", "⊥")}
    {@render mathKey("\\neg", "¬")}
    {@render mathKey("\\Box", "□")}
    {@render mathKey("\\Diamond", "◇")}
    {@render mathKey("\\land", "∧")}
    {@render mathKey("\\lor", "∨")}
    {@render mathKey("\\to", "→")}
    {@render mathKey("\\leftrightarrow", "↔")}
  </div>

  <input
    id="formula"
    list="formula-history"
    class={["ring-0 rounded focus:outline-none p-2 focus:ring-0 w-full", error && "border-primary"]}
    type="text"
    placeholder="Enter modal formula"
    disabled={disabled}
    bind:value={input}
    bind:this={inputElement} />
</div>
