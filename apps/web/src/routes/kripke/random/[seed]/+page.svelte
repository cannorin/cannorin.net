<script lang="ts">
import { type Formula, isomorphic, validWorlds } from "@cannorin/kripke";
import Template from "../../components/template.svelte";
import { getFrameBySeed } from "../../lib/system";

let { data } = $props();
const seed = data.seed;
const { id, frame } = getFrameBySeed(seed);
const guess = (frameId: number) => isomorphic[frameId] === id;
const check = (formula: Formula) => validWorlds(frame, formula).length;
const getAnswer = () => id;
const getSeed = () => seed;
const relationSize = frame.relations.size;
</script>

{#snippet seedNumber()}
  <a class="text-primary font-medium underline" href={`/kripke/random/${seed}`}>{seed}</a>
{/snippet}

{#snippet title()}
  <h2 class="text-sm">
    <span class="font-bold">Random Challenge</span>
    <span>(seed: {@render seedNumber()})</span>
  </h2>
{/snippet}

{#snippet description()}
  <h2>Random Challenge!</h2>
  <ul>
    <li>The answer of the game is determined by a seed number {@render seedNumber()}.</li>
    <li>You can right-click on the seed number to obtain a permalink to this exact game.</li>
    <li>Unlike Daily Challenge, the progress of the game does not persist.</li>
    <li>You can also play <a href="/kripke">Daily Challenge</a>, if you have not yet.</li>
  </ul>
{/snippet}

<Template
  relationSize={relationSize}
  guess={guess}
  check={check}
  getAnswer={getAnswer}
  getSeed={getSeed}
  getShareProps={(moves, status) => ({ moves, status, seed })}
  title={title}
  description={description}
  newGame={{ href: "/kripke/random", text: "Play New Game" }}
/>
