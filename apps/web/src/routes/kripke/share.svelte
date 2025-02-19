<script lang="ts">
import SiBluesky from "@icons-pack/svelte-simple-icons/icons/SiBluesky";
import SiMastodon from "@icons-pack/svelte-simple-icons/icons/SiMastodon";
import SiMisskey from "@icons-pack/svelte-simple-icons/icons/SiMisskey";
import SiX from "@icons-pack/svelte-simple-icons/icons/SiX";
import type { GameStatus, Move } from "./game.svelte";

let {
  date,
  moves,
  status,
  seed,
}: { moves: Move[]; status: GameStatus } & (
  | { date: string; seed?: undefined }
  | { seed: number; date?: undefined }
) = $props();

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
      }
    })
    .join("");

  const text = `#KRIPKE_game (${date ?? ""}${seed ? `seed ${seed}` : ""})

${history} ${status === "win" ? moves.length : "X"}/10

https://www.cannorin.net/kripke${seed ? `/random?seed=${seed}` : ""}`;

  return encodeURIComponent(text);
});
</script>

<nav class="h-9 flex items-center justify-between gap-4 mr-auto">
  <ul class="flex items-center gap-4">
    <li>
      <a href="https://x.com/intent/tweet?text={shareText}" target="_blank" rel="noopener noreferrer">
        <SiX size={20} />
        <span class="sr-only"> Share to X (Twitter)</span>
      </a>
    </li>
    <li>
      <a href="https://mastoshare.net/share?text={shareText}" target="_blank" rel="noopener noreferrer">
        <SiMastodon size={20} />
        <span class="sr-only"> Share to Mastodon</span>
      </a>
    </li>
    <li>
      <a href="https://misskeyshare.link/share.html?text={shareText}" target="_blank" rel="noopener noreferrer">
        <SiMisskey size={20} />
        <span class="sr-only"> Share to Misskey</span>
      </a>
    </li>
    <li>
      <a href="https://bsky.app/intent/compose?text={shareText}" target="_blank" rel="noopener noreferrer">
        <SiBluesky size={20} />
        <span class="sr-only"> Share to Bluesky</span>
      </a>
    </li>
  </ul>
</nav>
