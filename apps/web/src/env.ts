import { defineEnvVars } from "@sveltejs/kit/env";

export const variables = defineEnvVars({
  MISSKEY_API_KEY: { static: true },
  PUBLIC_WEB_DOMAIN: { public: true, static: true },
});
