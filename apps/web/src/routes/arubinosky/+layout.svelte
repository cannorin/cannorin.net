<script lang="ts">
import "./theme.css";

let { children } = $props();

$effect.pre(() => {
  const icon: HTMLLinkElement | null =
    document.querySelector("link[rel~='icon']");
  if (icon) icon.href = "/favicon2.png";
});
</script>

{@render children()}
