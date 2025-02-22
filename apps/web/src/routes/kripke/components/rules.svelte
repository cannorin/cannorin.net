<script lang="ts">
import Katex from "$lib/components/katex.svelte";
import {
  andSymbols,
  botSymbols,
  boxSymbols,
  diamondSymbols,
  eqSymbols,
  lParenSymbols,
  notSymbols,
  orSymbols,
  rParenSymbols,
  toSymbols,
  topSymbols,
} from "@cannorin/kripke";
import LuHeart from "lucide-svelte/icons/heart";

let { relationSize }: { relationSize: number } = $props();

const frame = "\\footnotesize \\mathcal{F} = \\left<W, R\\right>";
const worldConstraint = "\\footnotesize |W| = 4";
const relationConstraint = `\\footnotesize |R| = ${relationSize}`;
const f = "\\footnotesize \\mathcal{F}";
const validCount =
  "\\footnotesize \\mathrm{N}(\\varphi) = \\bigl| \\Set{ w \\in W | \\forall \\mathop{\\Vdash}\\, (w \\Vdash \\varphi) } \\bigr|";
</script>

<h2>Rules</h2>
<ul>
  <li>
    A <a href="https://en.wikipedia.org/wiki/Kripke_semantics" target="_blank" rel="noopener noreferrer">Kripke frame</a> with 4 worlds and {relationSize} relation(s) is generated:
    <Katex math={frame} />, where <Katex math={worldConstraint} /> and <Katex math={relationConstraint} />.
  </li>
  <li>
    You have a total of 10 moves <span class="inline-flex items-center max-w-fit">(<LuHeart aria-label="♡" size=12 class="mt-1"/>)</span>.
    In each move you can do one of the following:
    <ul>
      <li>
        Enter a modal formula.
        The game tells you in how many worlds the formula is valid.
        In other words, it tells you the following natural number:
        <div>
          <Katex math={validCount} />
        </div>
      </li>
      <li>
        Guess the Kripke frame.
        If your frame is equal or isomorphic to <Katex math={f} />, you win.
      </li>
    </ul>
  </li>
  <li>
    You lose when you run out of moves.
  </li>
</ul>

{#snippet symbols(words: string[])}
  {#each words as word, i}
    {i > 0 ? ", " : ""}<code>{word}</code>
  {/each}
{/snippet}

<h2>Syntax</h2>
<p>You may use the following symbols:</p>
<ul>
  <li>propositional variables: {@render symbols(["p", "q", "r", "s"])}</li>
  <li>verum: {@render symbols(topSymbols)}</li>
  <li>falsum: {@render symbols(botSymbols)}</li>
  <li>negation: {@render symbols(notSymbols)}</li>
  <li>box: {@render symbols(boxSymbols)}</li>
  <li>diamond: {@render symbols(diamondSymbols)}</li>
  <li>conjunction: {@render symbols(andSymbols)}</li>
  <li>disjunction: {@render symbols(orSymbols)}</li>
  <li>implication: {@render symbols(toSymbols)}</li>
  <li>equivalence: {@render symbols(eqSymbols)}</li>
  <li>parentheses: {@render symbols([...lParenSymbols, ...rParenSymbols])}</li>
</ul>
