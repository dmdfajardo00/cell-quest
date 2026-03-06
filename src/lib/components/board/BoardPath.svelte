<script lang="ts">
  import type { CheckpointData } from '../../data/types';

  interface Props {
    difficulty: 'easy' | 'moderate' | 'difficult';
    checkpoints: CheckpointData[];
  }

  let { difficulty, checkpoints }: Props = $props();

  function generatePathD(points: { x: number; y: number }[]): string {
    if (points.length < 2) return '';
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cpx1 = prev.x + (curr.x - prev.x) * 0.5;
      const cpy1 = prev.y;
      const cpx2 = prev.x + (curr.x - prev.x) * 0.5;
      const cpy2 = curr.y;
      d += ` C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${curr.x} ${curr.y}`;
    }
    return d;
  }

  let fullPathD = $derived(generatePathD(checkpoints));

  let lastCompletedIndex = $derived.by(() => {
    let last = -1;
    for (let i = 0; i < checkpoints.length; i++) {
      if (checkpoints[i].state === 'completed') last = i;
    }
    return last;
  });

  let completedPathD = $derived.by(() => {
    if (lastCompletedIndex < 0) return '';
    const completedPoints = checkpoints.slice(0, lastCompletedIndex + 1);
    return generatePathD(completedPoints);
  });
</script>

<defs>
  <filter id="path-glow">
    <feGaussianBlur stdDeviation="4" result="blur" />
    <feMerge>
      <feMergeNode in="blur" />
      <feMergeNode in="SourceGraphic" />
    </feMerge>
  </filter>
</defs>

<!-- Full path (dimmed) -->
<path
  d={fullPathD}
  fill="none"
  stroke="#A78BFA"
  stroke-width="4"
  stroke-dasharray="12 8"
  stroke-linecap="round"
  opacity="0.4"
/>

<!-- Completed path overlay -->
{#if completedPathD}
  <path
    d={completedPathD}
    fill="none"
    stroke="#A78BFA"
    stroke-width="4"
    stroke-linecap="round"
    opacity="1"
    filter="url(#path-glow)"
  />
{/if}
