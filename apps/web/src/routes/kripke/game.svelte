<script lang="ts">
import Katex from "$lib/components/katex.svelte";
import {
  type Formula,
  type Frame,
  getFrame,
  getId,
  isomorphic,
  latexSymbols,
  prettyPrint,
} from "@cannorin/kripke";
import LuHeart from "lucide-svelte/icons/heart";
import LuHeartCrack from "lucide-svelte/icons/heart-crack";
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
};

let {
  status = $bindable<GameStatus>("playing"),
  moves = $bindable<Move[]>([]),
  relationSize,
  guess: guessImpl,
  check: checkImpl,
}: Props = $props();

let formula: Formula | undefined = $state(undefined);
let frame: Frame = $state(getFrame(0));
let math = $derived.by(() => {
  if (formula) return prettyPrint(formula, { symbols: latexSymbols });
  return "\\phantom{p}";
});

let remainingRelations = $derived(relationSize - frame.relations.size);

let life = $derived(10 - moves.length);

$effect(() => {
  if (life <= 0) {
    status = "lose";
    return;
  }
  if (moves.some((move) => move.type === "guess" && move.correct)) {
    status = "win";
    return;
  }
});

let canGuess = $derived.by(() => {
  if (status !== "playing" || remainingRelations !== 0) return false;
  const frameId = isomorphic[getId(frame)];
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
  const formulaStr = prettyPrint(formula);
  return !moves.some(
    (move) => move.type === "check" && move.formulaStr === formulaStr,
  );
});

async function check() {
  if (!canCheck || !formula) return;
  const valid = await checkImpl(formula);
  const formulaStr = prettyPrint(formula, { symbols: latexSymbols });
  moves.push({ type: "check", formulaStr, valid });
  moves = [...moves];
  formula = undefined;
}
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
        <LuHeart class="text-primary" />
      {:else}
        <LuHeartCrack class="text-muted" />
      {/if}
    {/each}
  </div>

  <div class="flex flex-col items-center gap-2">
    <div class="w-[300px] h-[300px] flex flex-col items-center justify-betwenn border rounded border-border">
      <span class="text-xs text-muted self-start px-2 py-1">id: {isomorphic[getId(frame)]}</span>
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

  <div class="flex flex-col items-center gap-2">
    <Katex math={math} />
    <FormulaInput bind:formula disabled={status !== "playing"} />
    <button
      onclick={check}
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
  </div>

  <div>
    <ul class="flex flex-col gap-2">
      {#each moves as move}
        <li>
          {#if move.type === "guess"}
            Guess({move.frameId}) = {move.correct}
          {/if}
          {#if move.type === "check"}
            Valid({move.formulaStr}) = {move.valid}
          {/if}
        </li>
      {/each}
    </ul>
  </div>
</div>
