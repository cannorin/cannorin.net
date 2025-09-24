<script lang="ts">
import { type Formula, isomorphic, validWorlds } from "@cannorin/kripke";
import { onMount } from "svelte";
import Template from "./components/template.svelte";
import { daily } from "./lib/store";
import { getFrameBySeed, getTimeUntilNextGame } from "./lib/system";

let { data } = $props();
const seed = data.seed;
const { id, frame } = getFrameBySeed(seed);
const guess = (frameId: number) => isomorphic[frameId] === id;
const check = (formula: Formula) => validWorlds(frame, formula).length;
const getAnswer = () => id;
const getSeed = () => seed;
const relationSize = frame.relations.size;

let timeUntilNextGame = $state(getTimeUntilNextGame());
onMount(() => {
  const interval = setInterval(() => {
    timeUntilNextGame = getTimeUntilNextGame();
  }, 1000);
  return () => {
    clearInterval(interval);
  };
});
</script>

{#snippet title()}
  <h2 class="text-sm">
    <span class="font-bold">Daily Challenge: </span>
    {timeUntilNextGame.hours}:{timeUntilNextGame.minutes}:{timeUntilNextGame.seconds} until the next game.
  </h2>
{/snippet}

{#snippet description()}
  <h2>Daily Challenge!</h2>
  <ul>
    <li>The answer of the game changes every day.</li>
    <li>The progress of the game persists until the next day ({timeUntilNextGame.hours}:{timeUntilNextGame.minutes}:{timeUntilNextGame.seconds} from now).</li>
    <li>You can also play <a href="/kripke/random">Random Challenge</a>.</li>
  </ul>
{/snippet}

<Template
  bind:moves={$daily.moves}
  relationSize={relationSize}
  guess={guess}
  check={check}
  getAnswer={getAnswer}
  getSeed={getSeed}
  getShareProps={(moves, status) => ({ moves, status, date: $daily.date })}
  title={title}
  description={description}
  newGame={{ href: "/kripke/random", text: "Play Random Challenge" }}
/>
