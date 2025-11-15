<script lang="ts">
import SiBluesky from "@icons-pack/svelte-simple-icons/icons/SiBluesky";
import SiMastodon from "@icons-pack/svelte-simple-icons/icons/SiMastodon";
import SiMisskey from "@icons-pack/svelte-simple-icons/icons/SiMisskey";
import SiX from "@icons-pack/svelte-simple-icons/icons/SiX";
import type { GameStatus, Move } from "./game.svelte";

export type ShareProps = { moves: Move[]; status: GameStatus } & (
  | { date: string; seed?: undefined }
  | { seed: number; date?: undefined }
);

let { date, moves, status, seed }: ShareProps = $props();

const numberEmojis = ["0️⃣", "1️⃣", "2️⃣", "3️⃣", "4️⃣"];

let shareText = $derived.by(() => {
  const history = moves
    .map((move) => {
      switch (move.type) {
        case "guess": {
          return move.correct ? "✅" : "❎";
        }
        case "check": {
          return numberEmojis[move.valid];
        }
        default: {
          throw new Error("impossible");
        }
      }
    })
    .join("");

  const text = `#KRIPKE_game (${date ?? ""}${seed ? `seed ${seed}` : ""})

${history} ${status === "win" ? moves.length : "X"}/10

https://www.cannorin.net/kripke${seed ? `/random/${seed}` : ""}`;

  return encodeURIComponent(text);
});
</script>

<nav class="h-9 flex items-center justify-between gap-4 mr-auto">
  <ul class="flex items-center gap-4">
    <li>
      <a href="https://x.com/intent/tweet?text={shareText}" target="_blank" rel="noopener noreferrer">
        <SiX title="Share to X (Twitter)" size={20} />
      </a>
    </li>
    <li>
      <a href="https://mastoshare.net/share?text={shareText}" target="_blank" rel="noopener noreferrer">
        <SiMastodon title="Share to Mastodon" size={20} />
      </a>
    </li>
    <li>
      <a href="https://misskeyshare.link/share.html?text={shareText}" target="_blank" rel="noopener noreferrer">
        <SiMisskey title="Share to Misskey" size={20} />
      </a>
    </li>
    <li>
      <a href="https://bsky.app/intent/compose?text={shareText}" target="_blank" rel="noopener noreferrer">
        <SiBluesky title="Share to Bluesky" size={20} />
      </a>
    </li>
  </ul>
</nav>
