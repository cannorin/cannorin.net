<script lang="ts">
import Katex from "$lib/components/katex.svelte";

import { cn } from "$lib/utils";
import {
  type Formula,
  type Frame,
  getFrame,
  getId,
  isomorphic,
  latexSymbols,
  prettyPrint,
} from "@cannorin/kripke";
import LuCheck from "lucide-svelte/icons/check";
import LuHeart from "lucide-svelte/icons/heart";
import LuHeartCrack from "lucide-svelte/icons/heart-crack";
import LuX from "lucide-svelte/icons/x";
import FormulaInput from "./formula-input.svelte";
import FrameInput from "./frame-input.svelte";

export type GameStatus = "win" | "lose" | "playing";

export type Move =
  | { type: "guess"; frameId: number; correct: boolean }
  | { type: "check"; formulaStr: string; valid: number };

export type Props = {
  status?: GameStatus;
  moves?: Move[];
  relationSize: number;
  guess: (frameId: number) => boolean | Promise<boolean>;
  check: (formula: Formula) => number | Promise<number>;
  getAnswer: () => number | Promise<number>;
  onShare?: () => void;
};

let {
  status = $bindable<GameStatus>("playing"),
  moves = $bindable<Move[]>([]),
  relationSize,
  guess: guessImpl,
  check: checkImpl,
  getAnswer,
  onShare,
}: Props = $props();

let formula: Formula | undefined = $state(undefined);
let formulaStr = $derived(
  formula ? prettyPrint(formula, { symbols: latexSymbols }) : "",
);
let frame: Frame = $state(getFrame(0));
let frameId = $derived(getId(frame));

let remainingRelations = $derived(relationSize - frame.relations.size);

let life = $derived(10 - moves.length);

$effect(() => {
  if (moves.some((move) => move.type === "guess" && move.correct)) {
    status = "win";
  } else if (life <= 0) {
    status = "lose";
  }
});

let canGuess = $derived.by(() => {
  if (status !== "playing" || remainingRelations !== 0) return false;
  const frameId = getId(frame);
  return !moves.some(
    (move) => move.type === "guess" && move.frameId === frameId,
  );
});

async function guess() {
  if (!canGuess) return;
  const frameId = getId(frame);
  const correct = await guessImpl(frameId);
  moves.push({ type: "guess", frameId, correct });
  moves = [...moves];
}

let canCheck = $derived.by(() => {
  if (status !== "playing" || life === 1 || !formula) return false;
  return !moves.some(
    (move) => move.type === "check" && move.formulaStr === formulaStr,
  );
});

async function check() {
  if (!canCheck || !formula) return;
  const valid = await checkImpl(formula);
  moves.push({ type: "check", formulaStr, valid });
  moves = [...moves];
  formula = undefined;
}

const colors: Record<number, string> = {
  0: "bg-muted",
  1: "bg-red-700",
  2: "bg-amber-700",
  3: "bg-yellow-600",
  4: "bg-green-700",
};
</script>

{#snippet sampleArrow()}
  <svg width="50" height="10" class="mt-[2px]">
    <defs>
      <marker
        id="arrowhead"
        viewBox="0 0 10 10"
        refX="8"
        refY="5"
        markerWidth="6"
        markerHeight="6"
        orient="auto"
        markerUnits="strokeWidth"
      >
        <path d="M0,0 L0,10 L10,5 z" fill="rgb(var(--foreground))" />
      </marker>
    </defs>
    <path d="M 5 5 L 45 5" stroke="rgb(var(--foreground))" stroke-width="1" marker-end="url(#arrowhead)" />
  </svg>
{/snippet}

<div class="w-[300px] flex flex-col gap-4">
  <div class="flex items-center justify-between">
    {#each [1,2,3,4,5,6,7,8,9,10] as i}
      {#if i <= life}
        <LuHeart class={cn("text-primary", life <= 3 && "animate-pulse")} />
      {:else}
        <LuHeartCrack class="text-muted animate-blink" />
      {/if}
    {/each}
  </div>

  <div class="flex flex-col items-center gap-2">
    <div class="w-[300px] h-[300px] flex flex-col items-center justify-between border rounded border-border">
      <span class="text-xs text-muted self-start px-2 py-1">id: {frameId} (≈ {isomorphic[frameId]})</span>
      <FrameInput bind:frame disabled={status !== "playing"} />
      <span class="text-sm px-2 py-1 self-end flex items-center">
        {@render sampleArrow()} × {remainingRelations}
      </span>
    </div>

    <button
      onclick={guess}
      disabled={!canGuess}
      class={[
        "rounded w-full p-1 text-background font-bold flex items-center justify-center gap-2",
        canGuess ? "bg-primary" : "bg-muted cursor-not-allowed"
      ]}>
      Guess! <span class="flex items-center font-normal">(<LuHeart size=14 class="mt-1 mr-[1px]"/> 1)</span>
    </button>
  </div>

  <form
    class="flex flex-col items-center gap-2"
    onsubmit={(e) => { e.preventDefault(); check(); }}>
    <FormulaInput bind:formula disabled={status !== "playing"} />
    <button
      type="submit"
      disabled={!canCheck}
      class={[
        "rounded w-full p-1 text-background font-bold flex items-center justify-center gap-2",
        canCheck ? "bg-primary" : "bg-muted cursor-not-allowed"
      ]}>
      {#if life <= 1}
        Can't Check <span class="font-normal">(Last Move!)</span>
      {:else}
        Check! <span class="flex items-center font-normal">(<LuHeart size=14 class="mt-1 mr-[1px]"/> 1)</span>
      {/if}
    </button>
  </form>

  <div>
    <ul class="flex flex-col-reverse gap-2">
      {#each moves as move}
        {#if move.type === "guess"}
          <li class="flex justify-between items-center animate-fade-in">
            <FrameInput disabled width={125} height={125} frame={getFrame(move.frameId)} />
            <span class={["rounded w-6 h-6 min-w-6 min-h-6 max-w-6 max-h-6 text-background flex items-center justify-center", move.correct ? "bg-green-700" : "bg-muted"]}>
              {#if move.correct}
                <LuCheck size=24 />
              {:else}
                <LuX size=24 />
              {/if}
            </span>
          </li>
        {/if}
        {#if move.type === "check"}
          <li class="flex justify-between items-center animate-fade-in">
            <Katex math={move.formulaStr} />
            <span class={["rounded w-6 h-6 min-w-6 min-h-6 max-w-6 max-h-6 text-background font-bold flex items-center justify-center pb-[2px]", colors[move.valid]]}>{move.valid}</span>
          </li>
        {/if}
      {/each}
      {#if formulaStr}
        <li class="flex justify-between items-center animate-fade-in">
          <Katex math={formulaStr} />
          <span class={["rounded w-6 h-6 min-w-6 min-h-6 max-w-6 max-h-6 text-background font-bold flex items-center justify-center pb-[2px] bg-muted"]}>?</span>
        </li>
      {/if}
      {#if status === "win"}
        <li>
          <button
            class="flex flex-col items-center gap-2 rounded bg-green-700 text-background p-5 animate-fade-in w-full"
            onclick={() => onShare?.()}>
            <p class="text-xl font-bold">YOU WIN!</p>
            <p class="sr-only">Open result screen</p>
          </button>
        </li>
      {:else if status === "lose"}
        {#await getAnswer() then answerId}
          <li>
            <button
              class="flex flex-col gap-2 rounded bg-foreground text-background p-5 animate-fade-in w-full"
              onclick={() => onShare?.()}>
              <div>
                <p class="text-xl font-bold">YOU LOSE!</p>
                <p class="text-sm">The answer was:</p>
              </div>
              <div class="flex flex-col items-center rounded bg-background w-full">
                <span class="text-xs text-muted self-start px-2 py-1">id: {answerId}</span>
                <FrameInput class="pb-6" disabled width={250} height={250} frame={getFrame(answerId)} />
              </div>
              <p class="sr-only">Open result screen</p>
            </button>
          </li>
        {/await}
      {/if}
    </ul>
  </div>
</div>

