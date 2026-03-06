<script lang="ts">
  import { type Snippet } from 'svelte';
  import { play } from '../../audio/soundManager';

  let {
    onclick,
    disabled = false,
    variant = 'primary',
    size = 'md',
    children
  }: {
    onclick?: (e: MouseEvent) => void;
    disabled?: boolean;
    variant?: 'primary' | 'secondary' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    children: Snippet;
  } = $props();

  function handleClick(e: MouseEvent) {
    play('tap');
    onclick?.(e);
  }
</script>

<button
  class="blob-button {variant} {size}"
  onclick={handleClick}
  {disabled}
>
  {@render children()}
</button>

<style>
  .blob-button {
    font-family: var(--font-display);
    font-weight: 600;
    border: none;
    border-radius: 16px;
    cursor: pointer;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
    user-select: none;
    line-height: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  /* Sizes - compact for landscape mobile */
  .sm { padding: 8px 20px; font-size: 13px; }
  .md { padding: 11px 24px; font-size: 14px; }
  .lg { padding: 14px 32px; font-size: 16px; }

  /* Primary */
  .primary {
    background: #7C3AED;
    color: #fff;
    box-shadow: 0 5px 0 #6D28D9;
  }
  .primary:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 7px 0 #6D28D9;
  }
  .primary:active:not(:disabled) {
    transform: translateY(3px);
    box-shadow: 0 2px 0 #6D28D9;
  }

  /* Secondary */
  .secondary {
    background: #F3EEFF;
    color: var(--purple);
    box-shadow: 0 5px 0 #E0D4F7;
  }
  .secondary:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 7px 0 #E0D4F7;
  }
  .secondary:active:not(:disabled) {
    transform: translateY(3px);
    box-shadow: 0 2px 0 #E0D4F7;
  }

  /* Danger */
  .danger {
    background: var(--coral);
    color: #fff;
    box-shadow: 0 5px 0 #E05555;
  }
  .danger:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 7px 0 #E05555;
  }
  .danger:active:not(:disabled) {
    transform: translateY(3px);
    box-shadow: 0 2px 0 #E05555;
  }

  /* Disabled */
  .blob-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
</style>
