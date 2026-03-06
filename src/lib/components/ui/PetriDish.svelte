<script lang="ts">
  import { type Snippet } from 'svelte';

  let {
    children
  }: {
    children: Snippet;
  } = $props();
</script>

<div class="petri-dish">
  {@render children()}
</div>

<style>
  .petri-dish {
    background: rgba(255, 255, 255, 0.04);
    border: 1.5px solid rgba(255, 255, 255, 0.08);
    border-radius: 50% 48% 52% 50% / 50% 52% 48% 50%;
    padding: 32px;
    text-align: center;
    position: relative;
  }

  .petri-dish::after {
    content: '';
    position: absolute;
    inset: 8px;
    border: 1px dashed rgba(255, 255, 255, 0.05);
    border-radius: 50% 48% 52% 50% / 50% 52% 48% 50%;
    pointer-events: none;
  }
</style>
