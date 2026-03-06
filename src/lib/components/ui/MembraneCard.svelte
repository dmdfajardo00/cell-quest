<script>
  import { type Snippet } from 'svelte';

  let {
    children
  }: {
    children: Snippet;
  } = $props();
</script>

<div class="membrane-card">
  {@render children()}
</div>

<style>
  .membrane-card {
    background: var(--light-surface);
    border: 1.5px solid var(--light-border);
    border-radius: 20px;
    padding: 24px;
    box-shadow: 0 8px 40px rgba(0, 0, 0, 0.06);
  }
</style>
