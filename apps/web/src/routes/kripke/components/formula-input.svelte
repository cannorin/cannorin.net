<script lang="ts">
import { type Formula, prettyPrint, tryParse } from "@cannorin/kripke";

let {
  formula = $bindable<Formula | undefined>(undefined),
  disabled = false,
}: {
  formula?: Formula | undefined;
  disabled?: boolean | undefined;
} = $props();

let input = $state(formula ? prettyPrint(formula) : "");
let error = $state(false);

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

<input
  class={["rounded border border-foreground ring-0 focus:outline-none focus:ring-0 p-2 w-full", error && "border-primary"]}
  type="text"
  placeholder="Enter modal formula"
  disabled={disabled}
  bind:value={input} />
