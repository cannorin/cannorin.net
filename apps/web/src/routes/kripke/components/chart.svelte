<script lang="ts">
import { scaleLog } from "d3-scale";

import { Area, AreaChart, Axis, Labels, Points, Svg } from "layerchart";

export type Props = {
  playerData: number[];
};

let { playerData }: Props = $props();

const data = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => ({
  move: i,
  player: playerData[i],
}));
</script>

<AreaChart
  data={data}
  x="move"
  series={[
    {
      key: "player",
      label: "You",
      color: "rgb(var(--primary))"
    },
  ]}
  seriesLayout="overlap"
  yScale={scaleLog()}
  yDomain={[1, 1000]}
  renderContext="svg">
  <Svg>
    <Axis
      placement="left"
      tickLength={10}
      grid={{ ["class"]: "stroke-muted", style: "stroke-dasharray: 2" }}
      ticks={[1,10,100,1000]}
      class="fill-foreground" />
    <Axis
      placement="bottom"
      tickLength={10}
      class="fill-foreground" />

    <Area
      y1={(d) => d.player}
      fill={"rgb(var(--primary))"}
      fillOpacity={0.3}
      line={{ class: "stroke-2", stroke: "rgb(var(--primary))" }}
    />
    <Points
      y={(d) => d.player}
      r={9}
      class="fill-primary"
    />
    <Labels
      y={(d) => d.player}
      placement="center"
      offset={-1.1}
      format={(x) => x}
      class="text-[10px] fill-background font-bold"
    />
  </Svg>
</AreaChart>
