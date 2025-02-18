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
  validWorlds,
} from "@cannorin/kripke";
import LuHeart from "lucide-svelte/icons/heart";
import LuHeartCrack from "lucide-svelte/icons/heart-crack";
import FormulaInput from "./formula-input.svelte";
import FrameInput from "./frame-input.svelte";
import { getDailyFrame } from "./system";

let formula: Formula | undefined = $state(undefined);
let frame: Frame = $state(getFrame(0));
let math = $derived.by(() => {
  if (formula) return prettyPrint(formula, { symbols: latexSymbols });
  return "\\phantom{p}";
});

const dailyFrame = getDailyFrame();
const dailyFrameId = isomorphic[getId(dailyFrame)];
let remainingRelations = $derived(
  dailyFrame.relations.size - frame.relations.size,
);

type Move =
  | { type: "guess"; frameId: number; correct: boolean }
  | { type: "check"; formulaStr: string; valid: number };

let moves: Move[] = $state([]);
let life = $derived(10 - moves.length);

let canGuess = $derived.by(() => {
  if (remainingRelations !== 0) return false;
  const frameId = isomorphic[getId(frame)];
  return !moves.some(
    (move) => move.type === "guess" && move.frameId === frameId,
  );
});
function guess() {
  if (!canGuess) return;
  const frameId = isomorphic[getId(frame)];
  moves.push({ type: "guess", frameId, correct: frameId === dailyFrameId });
  moves = [...moves];
}

let canCheck = $derived.by(() => {
  if (!formula) return false;
  const formulaStr = prettyPrint(formula);
  return !moves.some(
    (move) => move.type === "check" && move.formulaStr === formulaStr,
  );
});
function check() {
  if (!canCheck || !formula) return;
  const formulaStr = prettyPrint(formula);
  const valid = validWorlds(dailyFrame, formula).length;
  moves.push({ type: "check", formulaStr, valid });
  moves = [...moves];
  formula = undefined;
}
</script>

{#snippet sampleArrow()}
  <svg width="50" height="10" class="mt-[1px]">
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

<main class="flex flex-col min-h-screen max-w-full items-center gap-12 lg:gap-16 py-8">

  <h1 class="font-display text-6xl">KRiPkE</h1>

  <div class="flex flex-col md:flex-row-reverse gap-x-20 gap-y-8">
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
          <FrameInput bind:frame />
          <span class="text-sm px-2 py-1 self-end flex items-center">
            {@render sampleArrow()} × {remainingRelations}
          </span>
        </div>

        <button
          onclick={guess}
          disabled={!canGuess}
          class={[
            "rounded w-full p-1 text-background bg-primary font-bold flex items-center justify-center gap-2",
            !canGuess && "bg-muted cursor-not-allowed"
          ]}>
          Guess! <span class="flex items-center font-normal">(<LuHeart size=14 class="mt-1 mr-[1px]"/> 1)</span>
        </button>
      </div>

      <div class="flex flex-col items-center gap-2">
        <Katex math={math} />
        <FormulaInput bind:formula />
        <button
          onclick={check}
          disabled={!canCheck}
          class={[
            "rounded w-full p-1 text-background bg-primary font-bold flex items-center justify-center gap-2",
            !canCheck && "bg-muted cursor-not-allowed"
          ]}>
          Check! <span class="flex items-center font-normal">(<LuHeart size=14 class="mt-1 mr-[1px]"/> 1)</span>
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

    <div class="w-[300px] prose prose-sm">
      <h2>Rules</h2>
      <ul>
        <li>
          A Kripke frame with 4 worlds is generated.
        </li>
        <li>
          The game tells you how many accessibility relations are in the frame, but not the exact shape of it.
        </li>
        <li>
          You have a total of 10 moves <span class="inline-flex items-center max-w-fit">(<LuHeart aria-label="♡" size=12 class="mt-1"/>)</span>.
          In each move you can do one of the following:
          <ul>
            <li>
              Enter a modal formula.
              The game tells you in how many worlds the formula is valid (for every valuation).
            </li>
            <li>
              Guess the Kripke frame.
              If your frame is equal or isomorphic to the secret frame, you win.
            </li>
          </ul>
        </li>
        <li>
          You lose when you run out of moves.
        </li>
      </ul>

      <h2>Syntax</h2>
      <p>You may use the following symbols:</p>
      <ul>
        <li>propositional variables: <code>p</code>, <code>q</code>, <code>r</code>, <code>s</code></li>
        <li>verum: <code>T</code>, <code>⊤</code>, <code>1</code>, <code>\top</code></li>
        <li>falsum: <code>F</code>, <code>⊥</code>, <code>0</code>, <code>\bot</code></li>
        <li>negation: <code>~</code>, <code>¬</code>, <code>\neg</code>, <code>\lnot</code></li>
        <li>box modality: <code>[]</code>, <code>□</code>, <code>L</code>, <code>\Box</code></li>
        <li>diamond modality: <code>&lt;&gt;</code>, <code>⋄</code>, <code>M</code>, <code>\Diamond</code></li>
        <li>conjunction: <code>&amp;</code>, <code>^</code>, <code>∧</code>, <code>\wedge</code>, <code>\land</code></li>
        <li>disjunction: <code>|</code>, <code>v</code>, <code>∨</code>, <code>\vee</code>, <code>\lor</code></li>
        <li>implication: <code>-&gt;</code>, <code>→</code>, <code>\rightarrow</code>, <code>\to</code>, <code>\implies</code></li>
        <li>equivalence: <code>&lt;-&gt;</code>, <code>↔</code>, <code>\leftrightarrow</code>, <code>\iff</code></li>
        <li>parentheses: <code>(</code>, <code>)</code></li>
      </ul>
    </div>
  </div>
</main>
