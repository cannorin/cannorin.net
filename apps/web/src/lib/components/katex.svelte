<script lang="ts">
import katex from "katex";
import "katex/dist/katex.min.css";
import type { HTMLAttributes } from "svelte/elements";

export interface KatexProps extends HTMLAttributes<HTMLSpanElement> {
  displayMode?: boolean;
  math: string;
}

let { displayMode, math, ...rest }: KatexProps = $props();

let katexString = $derived.by(() =>
  katex.renderToString(math, { displayMode, throwOnError: false }),
);
</script>

<span {...rest}>
  {@html katexString}
</span>
