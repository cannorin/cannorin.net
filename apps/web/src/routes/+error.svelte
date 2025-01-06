<script lang="ts">
import { page } from "$app/state";
import { limitWidth } from "$lib/constants";
import { cn } from "$lib/utils";

const codeNames: Record<number, string> = {
  400: "Bad Request",
  401: "Unauthorized",
  402: "Payment Required",
  403: "Forbidden",
  404: "Not Found",
  405: "Method Not Allowed",
  406: "Not Acceptable",
  407: "Proxy Authentication Required",
  408: "Request Timeout",
  409: "Conflict",
  410: "Gone",
  411: "Length Required",
  412: "Precondition Required",
  413: "Payload Too Large",
  414: "URI Too Long",
  415: "Unsupported Media Type",
  416: "Range Not Satisfiable",
  417: "Expectation Failed",
  429: "Too Many Requests",
  451: "Unavailable For Legal Reasons",
  500: "Internal Server Error",
  501: "Not Implemented",
  502: "Bad Gateway",
  503: "Service Unavailable",
  504: "Gateway Timeout",
  505: "HTTP Version Not Supported",
};
</script>

<main class={cn("flex grow flex-col items-center justify-center gap-10 py-10 relative overflow-hidden", limitWidth)}>
  <section class="flex min-w-full flex-col items-center gap-6 ">
    <h1 class="text-center text-5xl font-display leading-[1.125]">
      <span>{page.status}</span>
      <span class="whitespace-nowrap">
        {codeNames[page.status] ?? "Unknown Error"}
      </span>
    </h1>

    <div class="text-sm">
      {#if page.status === 400}
        <p>リクエストの結果エラーが発生しました。</p>
      {:else if page.status === 401}
        <p>このページを表示するにはログインする必要があります。</p>
      {:else if page.status === 403}
        <p>このページを閲覧する権限がありません。</p>
      {:else if page.status === 404}
        <p>お探しのページは見つかりませんでした。</p>
      {:else}
        <p>{page.error?.message}</p>
      {/if}
    </div>
  </section>
</main>
