<script lang="ts">
import Katex from "$lib/components/katex.svelte";
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

<h2>Syntax</h2>
<p>You may use the following symbols:</p>
<ul>
  <li>propositional variables: <code>p</code>, <code>q</code>, <code>r</code>, <code>s</code></li>
  <li>verum: <code>⊤</code>, <code>T</code>, <code>1</code>, <code>\top</code></li>
  <li>falsum: <code>⊥</code>, <code>F</code>, <code>0</code>, <code>\bot</code></li>
  <li>negation: <code>¬</code>, <code>~</code>, <code>\neg</code>, <code>\lnot</code></li>
  <li>box modality: <code>□</code>, <code>[]</code>, <code>!</code>, <code>L</code>, <code>\Box</code></li>
  <li>diamond modality: <code>⋄</code>, <code>&lt;&gt;</code>, <code>?</code>, <code>M</code>, <code>\Diamond</code></li>
  <li>conjunction: <code>∧</code>, <code>^</code>, <code>&amp;</code>,  <code>\wedge</code>, <code>\land</code></li>
  <li>disjunction: <code>∨</code>, <code>v</code>, <code>|</code>, <code>\vee</code>, <code>\lor</code></li>
  <li>implication: <code>→</code>, <code>-&gt;</code>, <code>&gt;</code>, <code>\rightarrow</code>, <code>\to</code></li>
  <li>equivalence: <code>↔</code>,  <code>&lt;-&gt;</code>, <code>=</code>, <code>\leftrightarrow</code>, <code>\equiv</code></li>
  <li>parentheses: <code>(</code>, <code>)</code></li>
</ul>
