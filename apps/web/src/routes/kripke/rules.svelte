<script lang="ts">
import LuHeart from "lucide-svelte/icons/heart";
</script>

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
