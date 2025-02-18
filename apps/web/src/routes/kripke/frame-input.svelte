<script lang="ts">
import {
  type Frame,
  type Relation,
  type World,
  left,
  reverse,
  right,
  worlds,
} from "@cannorin/kripke";
import { type Vector, add, degree, rotate, sub, theta } from "./vector";

let {
  frame = $bindable<Frame>({ relations: new Set() }),
  disabled = false,
}: {
  frame?: Frame | undefined;
  disabled?: boolean | undefined;
} = $props();

let selected: World | null = $state(null);

function toggle(rel: Relation) {
  if (frame.relations.has(rel)) {
    frame.relations.delete(rel);
  } else {
    frame.relations.add(rel);
  }
  // Reassign to trigger reactivity
  frame = { relations: new Set(frame.relations) };
}

function handleNodeClick(node: World, event: MouseEvent) {
  event.stopPropagation();
  if (selected === null) {
    // Start a new edge
    selected = node;
  } else {
    // Toggle the edge from selectedNode -> nodeId
    const rel: Relation = `${selected}${node}` as Relation;
    toggle(rel);
    selected = null;
  }
}

function handleEdgeClick(rel: Relation, event: MouseEvent) {
  event.stopPropagation();
  toggle(rel);
}

// Clear selection if the user clicks on the background
function handleSvgClick() {
  selected = null;
}

const positions: Record<World, Vector> = {
  a: {
    x: 50,
    y: 50,
  },
  b: {
    x: 200,
    y: 50,
  },
  c: {
    x: 200,
    y: 200,
  },
  d: {
    x: 50,
    y: 200,
  },
};

const center: Vector = { x: 125, y: 125 };

const radius: Vector = { x: 20, y: 0 };

function getSelfPath(w: World) {
  const angle = theta(sub(center, positions[w])) + Math.PI;
  const offset = degree(45);
  const loopRadius = 20;
  const start = add(positions[w], rotate(radius, angle - offset));
  const end = add(positions[w], rotate(radius, angle + offset));

  return `
    M ${start.x} ${start.y}
    A ${loopRadius} ${loopRadius} 0 1 1 ${end.x} ${end.y}
  `;
}

function getPath(rel: Relation) {
  const l = left(rel);
  const r = right(rel);
  if (l === r) return getSelfPath(l);

  const angle = theta(sub(positions[r], positions[l]));

  const offset = frame.relations.has(reverse(rel)) ? degree(10) : 0;

  const dl = rotate(radius, angle + offset);
  const dr = rotate(radius, angle + Math.PI - offset);
  const from = add(positions[l], dl);
  const to = add(positions[r], dr);

  if (!frame.relations.has(reverse(rel)))
    return `M ${from.x} ${from.y} L ${to.x} ${to.y}`;

  return `M ${from.x} ${from.y} C ${from.x + dl.x * 2} ${from.y + dl.y * 2}, ${to.x + dr.x * 2} ${to.y + dr.y * 2}, ${to.x} ${to.y}`;
}
</script>

<style>
  .node {
    fill: rgb(var(--background));
    stroke: rgb(var(--foreground));
    stroke-width: 1;
  }
  .node.selected {
    stroke: rgb(var(--primary));
    stroke-width: 3;
  }
  .edge {
    stroke: rgb(var(--foreground));
    stroke-width: 1;
    fill: none;
    marker-end: url(#arrowhead);
  }
</style>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<svg width="250" height="250" onclick={handleSvgClick}>
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

  {#each Array.from(frame.relations) as rel}
    {#key rel}
      <path
        d={getPath(rel)}
        class={["edge", !disabled && "cursor-pointer"]}
        onclick={(e) => !disabled && handleEdgeClick(rel, e)}
      />
    {/key}
  {/each}

  {#each worlds as w}
    {@const x = positions[w].x}
    {@const y = positions[w].y}
    <circle
      cx={x}
      cy={y}
      r={radius.x}
      class={["node", selected === w && "selected", !disabled && "cursor-pointer"]}
      onclick={(e) => !disabled && handleNodeClick(w, e)}
    />
  {/each}
</svg>
