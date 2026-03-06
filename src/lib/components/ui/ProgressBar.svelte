<script lang="ts">
  let {
    progress,
    label
  }: {
    progress: number;
    label?: string;
  } = $props();

  let clampedProgress = $derived(Math.min(100, Math.max(0, progress)));
</script>

<div class="progress-wrapper">
  {#if label}
    <span class="progress-label">{label}</span>
  {/if}
  <div class="progress-track">
    <div
      class="progress-fill"
      style="width: {clampedProgress}%"
    ></div>
  </div>
</div>

<style>
  .progress-wrapper {
    display: flex;
    flex-direction: column;
    gap: 6px;
    width: 100%;
  }

  .progress-label {
    font-family: var(--font-display);
    font-size: 13px;
    font-weight: 600;
    color: var(--text-mid);
  }

  .progress-track {
    width: 100%;
    height: 14px;
    background: var(--light-bg);
    border: 1.5px solid var(--light-border);
    border-radius: 14px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    border-radius: 14px;
    background: linear-gradient(90deg, #7C3AED, #A78BFA);
    box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.4);
    transition: width 0.6s ease;
  }
</style>
