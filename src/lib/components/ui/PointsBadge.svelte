<script>
  let {
    points,
    animated = false
  }: {
    points: number;
    animated?: boolean;
  } = $props();

  let pop = $state(false);

  $effect(() => {
    // Track points so effect re-runs on change
    points;
    if (animated) {
      pop = true;
      const timeout = setTimeout(() => { pop = false; }, 400);
      return () => clearTimeout(timeout);
    }
  });
</script>

<span class="points-badge" class:score-pop={pop}>
  <svg class="star-icon" viewBox="0 0 24 24" width="16" height="16" fill="#D49A00" aria-hidden="true">
    <path d="M12 2l2.9 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14 2 9.27l7.1-1.01z" />
  </svg>
  {points}
</span>

<style>
  .points-badge {
    font-family: var(--font-display);
    font-size: 14px;
    font-weight: 600;
    color: #D49A00;
    background: #FFF8E8;
    border: 1.5px solid #D49A00;
    padding: 8px 16px;
    border-radius: 50px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    line-height: 1;
  }

  .star-icon {
    flex-shrink: 0;
  }

  .score-pop {
    animation: scorePop 0.4s ease;
  }
</style>
