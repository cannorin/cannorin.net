<script lang="ts">
import { type Formula, getId, isomorphic, validWorlds } from "@cannorin/kripke";
import LuHeart from "lucide-svelte/icons/heart";
import Game from "./game.svelte";
import { getDailyFrame } from "./system";

const dailyFrame = getDailyFrame();
const dailyFrameId = isomorphic[getId(dailyFrame)];
const relationSize = dailyFrame.relations.size;
const guess = (frameId: number) => isomorphic[frameId] === dailyFrameId;
const check = (formula: Formula) => validWorlds(dailyFrame, formula).length;
</script>

<main class="flex flex-col min-h-screen max-w-full items-center gap-12 lg:gap-16 py-8">
  <h1 class="font-display text-6xl">KRiPkE</h1>

  <div class="flex flex-col md:flex-row-reverse gap-x-20 gap-y-8">
    <Game relationSize={relationSize} guess={guess} check={check} />

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
