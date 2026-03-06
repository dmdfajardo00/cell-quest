<script>
  import { play } from '../../audio/soundManager';

  let { children } = $props();
  let visible = $state(false);

  function toggle() {
    visible = !visible;
    play(visible ? 'slideOpen' : 'slideClose');
  }
</script>

<button class="sidebar-toggle" class:sidebar-toggle-open={visible} onclick={toggle} aria-label="Toggle stats">
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M18 20V10"/>
    <path d="M12 20V4"/>
    <path d="M6 20v-6"/>
  </svg>
</button>

{#if visible}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="sidebar-backdrop" onclick={toggle}></div>
{/if}

<aside class="sidebar" class:sidebar-visible={visible}>
  {@render children()}
</aside>

<style>
  .sidebar-toggle {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 51;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    border: 1px solid var(--dark-border);
    background: var(--dark-surface);
    color: var(--text-on-dark-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    padding: 0;
    transition: right 0.25s ease, background 0.2s ease, color 0.2s ease;
  }

  .sidebar-toggle-open {
    right: 248px;
  }

  .sidebar-toggle:hover {
    background: var(--dark-bg);
    color: var(--text-on-dark);
  }

  .sidebar-backdrop {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 49;
  }

  .sidebar {
    width: 240px;
    height: 100%;
    background: var(--dark-surface);
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    border-left: 1px solid var(--dark-border);
    overflow-y: auto;
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 50;
    transform: translateX(100%);
    transition: transform 0.25s ease;
  }

  .sidebar-visible {
    transform: translateX(0);
  }
</style>
