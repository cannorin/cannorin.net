import { redirect } from "@sveltejs/kit";
import { randomSeed } from "../lib/system";

export async function load({ url }) {
  const seedStr = url.searchParams.get("seed");
  const seed = (() => {
    try {
      if (!seedStr) return randomSeed();
      const seed = Number.parseInt(seedStr);
      if (!Number.isSafeInteger(seed)) return randomSeed();
      return seed;
    } catch {
      return randomSeed();
    }
  })();
  redirect(302, `/kripke/random/${seed}`);
}
