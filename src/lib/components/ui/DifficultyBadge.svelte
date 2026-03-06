<script>
  let {
    difficulty
  }: {
    difficulty: 'easy' | 'moderate' | 'difficult';
  } = $props();

  const config = {
    easy: { bg: '#E8FAEB', color: '#28A745', border: '#28A745' },
    moderate: { bg: '#FFF8E8', color: '#D49A00', border: '#D49A00' },
    difficult: { bg: '#FFF0F0', color: '#D04040', border: '#D04040' }
  };

  let style = $derived(
    `background: ${config[difficulty].bg}; color: ${config[difficulty].color}; border-color: ${config[difficulty].border};`
  );
</script>

<span class="difficulty-badge" {style}>
  {difficulty}
</span>

<style>
  .difficulty-badge {
    font-family: var(--font-display);
    font-size: 12px;
    font-weight: 600;
    padding: 6px 16px;
    border-radius: 50px;
    border: 1.5px solid;
    display: inline-block;
    line-height: 1;
    text-transform: capitalize;
  }
</style>
