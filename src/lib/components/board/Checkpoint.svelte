<script lang="ts">
  import type { CheckpointState } from '../../data/types';
  import { organelles } from '../../data/organelles';

  interface Props {
    x: number;
    y: number;
    state: CheckpointState;
    organelle: string;
    id: number;
    onclick: (id: number) => void;
  }

  let { x, y, state, organelle, id, onclick }: Props = $props();

  let info = $derived(organelles[organelle]);
  let color = $derived(info?.color ?? '#A78BFA');
  let isClickable = $derived(state === 'active');
</script>

<g
  transform="translate({x}, {y})"
  class="checkpoint"
  class:checkpoint-locked={state === 'locked'}
  class:checkpoint-active={state === 'active'}
  class:checkpoint-completed={state === 'completed'}
  role={isClickable ? 'button' : undefined}
  tabindex={isClickable ? 0 : undefined}
  onclick={() => isClickable && onclick(id)}
  onkeydown={(e) => { if (isClickable && (e.key === 'Enter' || e.key === ' ')) onclick(id); }}
  style="cursor: {isClickable ? 'pointer' : 'default'}"
>
  <!-- Outer glow ring for active state -->
  {#if state === 'active'}
    <circle r="36" fill="none" stroke="#A78BFA" stroke-width="2" opacity="0.6">
      <animate attributeName="r" values="34;40;34" dur="2s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.6;0.2;0.6" dur="2s" repeatCount="indefinite" />
    </circle>
  {/if}

  <!-- Main circle -->
  {#if state === 'locked'}
    <circle r="28" fill="#2A2A3E" stroke="#555" stroke-width="2" opacity="0.5" />
  {:else if state === 'active'}
    <circle r="28" fill="#2D1B69" stroke={color} stroke-width="3">
      <animate attributeName="stroke-opacity" values="1;0.5;1" dur="1.5s" repeatCount="indefinite" />
    </circle>
  {:else}
    <circle r="28" fill="#2D1B69" stroke="#4ADE80" stroke-width="3" />
  {/if}

  <!-- Inner icon area -->
  {#if state === 'locked'}
    <!-- Lock icon -->
    <rect x="-6" y="-3" width="12" height="10" rx="2" fill="#555" opacity="0.5" />
    <path d="M-4,-3 L-4,-7 A4,4 0 0,1 4,-7 L4,-3" fill="none" stroke="#555" stroke-width="1.5" opacity="0.5" />
  {:else if state === 'completed'}
    <!-- Green checkmark -->
    <path d="M-8,0 L-3,5 L8,-5" fill="none" stroke="#4ADE80" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
  {:else}
    <!-- Organelle dot -->
    <circle r="8" fill={color} opacity="0.8" />
  {/if}

  <!-- Organelle name label -->
  <text
    y="44"
    text-anchor="middle"
    fill={state === 'locked' ? '#555' : '#C4B5FD'}
    font-size="11"
    font-family="sans-serif"
    opacity={state === 'locked' ? 0.5 : 0.9}
  >
    {organelle}
  </text>
</g>
