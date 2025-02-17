<script lang="ts">
import { type Formula, tryParse } from "@cannorin/kripke";

let {
  formula = $bindable<Formula | undefined>(undefined),
}: {
  formula?: Formula | undefined;
} = $props();

let input = $state("");
let error = $state(false);

$effect(() => {
  const fml = tryParse(input);
  if (fml) {
    formula = fml;
    error = false;
  } else if (input !== null && input.length > 0) error = true;
});
</script>

<input
  class={["rounded border border-foreground ring-0 focus:outline-none focus:ring-0 p-2 w-full", error && "border-primary"]}
  type="text"
  placeholder="Enter modal formula"
  bind:value={input} />
