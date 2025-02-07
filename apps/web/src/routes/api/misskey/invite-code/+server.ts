import { type RequestEvent, text } from "@sveltejs/kit";
import { RateLimiter } from "sveltekit-rate-limiter/server";

import { dev } from "$app/environment";
import { MISSKEY_API_KEY } from "$env/static/private";
import { sample } from "$lib";
import type { InviteListResponse } from "misskey-js/entities.js";

const limiter = new RateLimiter({
  IP: [10, "d"], // IP address limiter
  IPUA: [5, "10m"], // IP + User Agent limiter
});

export async function GET(event: RequestEvent) {
  if (!dev && (await limiter.isLimited(event)))
    return new Response("Too many requests", { status: 429 });

  const res = await fetch(
    "https://misskey.cannorin.net/api/admin/invite/list",
    {
      method: "POST",
      body: JSON.stringify({
        i: MISSKEY_API_KEY,
        type: "unused",
        sort: "+createdAt",
        limit: 10,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  const json = await res.json();
  const invite = sample(json as InviteListResponse).find(
    (x) => !x.createdBy && !x.usedAt,
  );
  if (invite) return text(invite.code);
  return new Response("Not found", { status: 404 });
}
