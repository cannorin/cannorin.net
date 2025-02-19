<script lang="ts">
import { page } from "$app/state";
import { Button } from "$lib/components/ui/button";
import * as Dialog from "$lib/components/ui/dialog";
import { type Formula, isomorphic, validWorlds } from "@cannorin/kripke";
import LuX from "lucide-svelte/icons/x";

import FrameInput from "../frame-input.svelte";
import Game, { type GameStatus, type Move } from "../game.svelte";
import Rules from "../rules.svelte";
import { getRandomFrame, randomSeed } from "../system";

const seed = (() => {
  const seedStr = page.url.searchParams.get("seed");
  if (seedStr) {
    const seed = Math.floor(Number.parseInt(seedStr));
    return seed;
  }
  return randomSeed();
})();

const { id, frame } = getRandomFrame(seed);
const guess = (frameId: number) => isomorphic[frameId] === id;
const check = (formula: Formula) => validWorlds(frame, formula).length;
const getAnswer = () => id;
const relationSize = frame.relations.size;

let moves: Move[] = $state([]);
let status: GameStatus = $state("playing");

let dialogOpen = $state(false);
$effect(() => {
  if (status !== "playing") dialogOpen = true;
});
</script>

{#snippet seedNumber()}
  <a class="text-primary font-medium underline" href={`/kripke/random?seed=${seed}`}>{seed}</a>
{/snippet}

<main class="flex flex-col min-h-screen max-w-full items-center gap-12 lg:gap-16 py-8">
  <h1 class="font-display text-6xl">KRiPkE</h1>

  <div class="flex flex-col md:flex-row-reverse gap-x-20 gap-y-8">
    <section class="flex flex-col gap-2">
      <h2 class="text-sm">
        <span class="font-bold">Random Challenge</span>
        <span>(seed: {@render seedNumber()})</span>
      </h2>
      <Game bind:moves bind:status relationSize={relationSize} guess={guess} check={check} getAnswer={getAnswer} />
    </section>

    <section class="w-[300px] prose prose-sm">
      <h2>Random Challenge!</h2>
      <ul>
        <li>The answer of the game is determined by a seed number {@render seedNumber()}, which changes on every reload.</li>
        <li>You can right-click on the seed number to obtain a permalink to this exact game.</li>
        <li>Unlike Daily Challenge, the progress of the game does not persist.</li>
        <li>You can also play <a href="/kripke">Daily Challenge</a>, if you have not yet.</li>
      </ul>

      <Rules />
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
          <span class="text-xs text-muted self-start px-2 py-1">id: {answerId}</span>
          <FrameInput class="pb-6" disabled width={250} height={250} frame={frame} />
        </div>

        <Dialog.Footer class="gap-x-1 gap-y-2">
          <Button
            variant="outline"
            onclick={() => (dialogOpen = false)}>
            <LuX class="w-4 h-4 mt-[2px]" /> Close
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  {/await}
{/if}
