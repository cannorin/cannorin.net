<script lang="ts">
import {
  type Formula,
  getFrame,
  isomorphic,
  nontrivials,
  tryParse,
  validWorlds,
} from "@cannorin/kripke";
import LuRotateCw from "lucide-svelte/icons/rotate-cw";
import LuX from "lucide-svelte/icons/x";
import type { Snippet } from "svelte";
import { Button } from "$lib/components/ui/button";
import * as Dialog from "$lib/components/ui/dialog";
import Chart from "./chart.svelte";
import FrameInput from "./frame-input.svelte";
import Game, { type GameStatus, type Move } from "./game.svelte";
import Rules from "./rules.svelte";
import Share, { type ShareProps } from "./share.svelte";

export type Props = {
  status?: GameStatus;
  moves?: Move[];
  relationSize: number;
  guess: (frameId: number) => boolean | Promise<boolean>;
  check: (formula: Formula) => number | Promise<number>;
  getAnswer: () => number | Promise<number>;
  getSeed?: () => number | Promise<number>;

  getShareProps: (
    moves: Move[],
    status: GameStatus,
  ) => ShareProps | Promise<ShareProps>;
  title: Snippet;
  description: Snippet;
  newGame: { href: string; text: string };
};

let {
  status = $bindable<GameStatus>("playing"),
  moves = $bindable<Move[]>([]),
  relationSize,
  guess,
  check,
  getAnswer,
  getSeed,
  getShareProps,
  title,
  description,
  newGame,
}: Props = $props();

let dialogOpen = $state(false);
$effect(() => {
  if (status !== "playing") dialogOpen = true;
});

function evaluate() {
  let frames = nontrivials
    .map((id) => ({ id, frame: getFrame(id) }))
    .filter((f) => f.frame.relations.size === relationSize);
  if (frames.length === 0) return undefined;

  const res: number[] = [frames.length];
  for (const move of moves) {
    if (move.type === "guess") {
      const frameId = isomorphic[move.frameId];
      if (move.correct) frames = [{ id: frameId, frame: getFrame(frameId) }];
      else frames = frames.filter((f) => f.id !== frameId);
    }
    if (move.type === "check") {
      if (move.valid < 0 || move.valid > 4) return undefined;
      const formula = tryParse(move.formulaStr);
      if (!formula) return undefined;
      frames = frames.filter(
        (f) => validWorlds(f.frame, formula).length === move.valid,
      );
    }

    if (frames.length === 0) return undefined;
    res.push(frames.length);
  }
  return res;
}
</script>

<main class="flex flex-col min-h-screen max-w-full items-center gap-12 lg:gap-16 py-8">
  <h1 class="font-display text-6xl">KRiPkE</h1>

  <div class="flex flex-col md:flex-row-reverse gap-x-20 gap-y-8">
    <section class="flex flex-col gap-2">
      {@render title()}
      <Game
        bind:moves bind:status relationSize={relationSize}
        guess={guess} check={check} getAnswer={getAnswer}
        onShare={() => { dialogOpen = true; }}/>
    </section>

    <section class="w-[300px] prose prose-sm">
      {@render description()}

      <Rules relationSize={relationSize} />
    </section>
  </div>
</main>

{#if status !== "playing"}
  {#await getAnswer() then answerId}
  {#await getShareProps(moves, status) then shareProps}
  {@const answerFrame = getFrame(answerId)}
  {@const playerData = evaluate()}
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

        <div class="flex flex-col items-center w-full bg-background mx-auto">
          <div class="w-fit">
            <span class="text-xs text-muted self-start px-2 py-1">
              {#if getSeed}
                {#await getSeed() then seed}
                  id: {answerId}, seed: <a class="text-primary underline font-medium" href="/kripke/random/{seed}">{seed}</a>
                {/await}
              {:else}
                id: {answerId}
              {/if}
            </span>
            <FrameInput disabled width={250} height={250} frame={answerFrame} />
          </div>
          <div class="w-full h-[125px] md:h-[200px] px-2 flex flex-col">
            <span class="text-xs pb-2">
              Statistics (frames left / moves)
            </span>
            {#if playerData}
              <Chart playerData={playerData} />
            {:else}
              <div class="flex flex-col items-center justify-center">
                Invalid play data
              </div>
            {/if}
          </div>
        </div>

        <Dialog.Footer>
          <div class="flex flex-col md:flex-row gap-2 w-full justify-end">
            <Share {...shareProps} />
            <Button
              data-sveltekit-reload
              href={newGame.href}>
              <LuRotateCw class="w-4 h-4 mt-[2px]" /> {newGame.text}
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
  {/await}
{/if}
