import { type RequestEvent, text } from "@sveltejs/kit";
import { RateLimiter } from "sveltekit-rate-limiter/server";

import { dev } from "$app/environment";
import { MISSKEY_API_KEY } from "$env/static/private";
import { api } from "misskey-js";

const limiter = new RateLimiter({
  IP: [10, "d"], // IP address limiter
  IPUA: [5, "10m"], // IP + User Agent limiter
});

const misskey = new api.APIClient({
  origin: "https://misskey.cannorin.net",
  credential: MISSKEY_API_KEY,
});

export async function GET(event: RequestEvent) {
  if (!dev && (await limiter.isLimited(event)))
    return new Response("Too many requests", { status: 429 });

  const invites = await misskey.request("admin/invite/list", {
    type: "unused",
    sort: "+createdAt",
    limit: 10,
  });

  const invite = invites.find((x) => !x.createdBy && !x.usedAt);
  if (invite) return text(invite.code);
  return new Response("Not found", { status: 404 });
}
