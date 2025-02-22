<script lang="ts">
import { Button } from "$lib/components/ui/button";
import * as Dialog from "$lib/components/ui/dialog";
import { type Formula, isomorphic, validWorlds } from "@cannorin/kripke";
import LuRotateCw from "lucide-svelte/icons/rotate-cw";
import LuX from "lucide-svelte/icons/x";
import { onMount } from "svelte";

import FrameInput from "./components/frame-input.svelte";
import Game, { type GameStatus } from "./components/game.svelte";
import Rules from "./components/rules.svelte";
import Share from "./components/share.svelte";

import { daily } from "./lib/store";
import { getFrameBySeed, getTimeUntilNextGame } from "./lib/system";

let { data } = $props();
const seed = data.seed;
const { id, frame } = getFrameBySeed(seed);
const guess = (frameId: number) => isomorphic[frameId] === id;
const check = (formula: Formula) => validWorlds(frame, formula).length;
const getAnswer = () => id;
const relationSize = frame.relations.size;

let status: GameStatus = $state("playing");
let dialogOpen = $state(false);
$effect(() => {
  if (status !== "playing") dialogOpen = true;
});

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

<main class="flex flex-col min-h-screen max-w-full items-center gap-12 lg:gap-16 py-8">
  <h1 class="font-display text-6xl">KRiPkE</h1>

  <div class="flex flex-col md:flex-row-reverse gap-x-20 gap-y-8">
    <section class="flex flex-col gap-2">
      <h2 class="text-sm">
        <span class="font-bold">Daily Challenge: </span>
        {timeUntilNextGame.hours}:{timeUntilNextGame.minutes}:{timeUntilNextGame.seconds} until the next game.
      </h2>
      <Game
        bind:moves={$daily.moves} bind:status relationSize={relationSize}
        guess={guess} check={check} getAnswer={getAnswer}
        onShare={() => { dialogOpen = true; }} />
    </section>

    <section class="w-[300px] prose prose-sm">
      <h2>Daily Challenge!</h2>
      <ul>
        <li>The answer of the game changes every day.</li>
        <li>The progress of the game persists until the next day ({timeUntilNextGame.hours}:{timeUntilNextGame.minutes}:{timeUntilNextGame.seconds} from now).</li>
        <li>You can also play <a href="/kripke/random">Random Challenge</a>.</li>
      </ul>

      <Rules relationSize={relationSize} />
    </section>
  </div>
</main>

{#if status !== "playing"}
  {#await getAnswer() then answerId}
    <Dialog.Root bind:open={dialogOpen}>
      <Dialog.Content class="animate-fade-in">
        <Dialog.Header>
          <Dialog.Title>
            {#if status === "win"}
              YOU WIN!
            {:else if status === "lose"}
              YOU LOSE!
            {/if}
          </Dialog.Title>
          <Dialog.Description>
            The answer was:
          </Dialog.Description>
        </Dialog.Header>

        <div class="flex flex-col items-center w-fit rounded bg-background mx-auto">
          <span class="text-xs text-muted self-start px-2 py-1">id: {answerId}, seed: <a class="text-primary underline font-medium" href="/kripke/random/{seed}">{seed}</a></span>
          <FrameInput class="pb-6" disabled width={250} height={250} frame={frame} />
        </div>

        <Dialog.Footer>
          <div class="flex flex-col md:flex-row gap-2 w-full justify-end">
            <Share date={$daily.date} moves={$daily.moves} status={status} />
            <Button
              href="/kripke/random">
              <LuRotateCw class="w-4 h-4 mt-[2px]" /> Play Random Challenge
            </Button>
            <Button
              variant="foreground"
              onclick={() => (dialogOpen = false)}>
              <LuX class="w-4 h-4 mt-[2px]" /> Close
            </Button>
          </div>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  {/await}
{/if}
