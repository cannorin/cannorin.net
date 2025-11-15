<script lang="ts">
import {
  type Frame,
  left,
  type Relation,
  reverse,
  right,
  type World,
  worlds,
} from "@cannorin/kripke";
import {
  add,
  degree,
  type Radian,
  rotate,
  sub,
  theta,
  type Vector,
} from "@cannorin/utils/vector";
import type { SVGAttributes } from "svelte/elements";

export interface FrameInputProps extends SVGAttributes<SVGElement> {
  frame?: Frame | undefined;
  disabled?: boolean | undefined;
}

let {
  frame = $bindable<Frame>({ relations: new Set() }),
  disabled = false,
  width,
  height,
  ...rest
}: FrameInputProps = $props();

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

function tip(position: Vector, angle: Radian) {
  const length = 8;
  const offset = degree(20);
  const lb = add(position, rotate({ x: length, y: 0 }, angle - offset));
  const rb = add(position, rotate({ x: length, y: 0 }, angle + offset));
  return { lb, rb };
}

function getSelfArrow(w: World) {
  const angle = theta(sub(center, positions[w])) + Math.PI;
  const offset = degree(45);
  const loopRadius = 20;
  const start = add(positions[w], rotate(radius, angle - offset));
  const end = add(positions[w], rotate(radius, angle + offset));
  const { lb, rb } = tip(end, angle + offset - degree(10));

  return {
    path: `M ${start.x} ${start.y} A ${loopRadius} ${loopRadius} 0 1 1 ${end.x} ${end.y}`,
    tipPolygon: `${end.x} ${end.y} ${lb.x} ${lb.y} ${rb.x} ${rb.y}`,
  };
}

function getArrow(rel: Relation) {
  const l = left(rel);
  const r = right(rel);
  if (l === r) return getSelfArrow(l);

  const angle = theta(sub(positions[r], positions[l]));

  const offset = frame.relations.has(reverse(rel)) ? degree(10) : 0;

  const dl = rotate(radius, angle + offset);
  const dr = rotate(radius, angle + Math.PI - offset);

  const from = add(positions[l], dl);
  const to = add(positions[r], dr);
  const { lb, rb } = tip(to, angle + Math.PI - offset);

  if (!frame.relations.has(reverse(rel)))
    return {
      path: `M ${from.x} ${from.y} L ${to.x} ${to.y}`,
      tipPolygon: `${to.x} ${to.y} ${lb.x} ${lb.y} ${rb.x} ${rb.y}`,
    };

  return {
    path: `M ${from.x} ${from.y} C ${from.x + dl.x * 2} ${from.y + dl.y * 2}, ${to.x + dr.x * 2} ${to.y + dr.y * 2}, ${to.x} ${to.y}`,
    tipPolygon: `${to.x} ${to.y} ${lb.x} ${lb.y} ${rb.x} ${rb.y}`,
  };
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
  }
  .tip {
    stroke: rgb(var(--foreground));
    stroke-width: 0.5;
    fill: rgb(var(--foreground));
  }
</style>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<svg width={width ?? 250} height={height ?? 250} {...rest} viewBox="0,0,250,250" onclick={handleSvgClick}  xmlns="http://www.w3.org/2000/svg">
  {#each Array.from(frame.relations) as rel}
    {@const { path, tipPolygon } = getArrow(rel)}
    <path
      d={path}
      class={["edge", !disabled && "cursor-pointer"]}
      onclick={(e) => !disabled && handleEdgeClick(rel, e)}
    />
    <polygon
      class="tip"
      points={tipPolygon}
      onclick={(e) => !disabled && handleEdgeClick(rel, e)}
    />
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
