<script lang="ts">
  import type { CheckpointData, Difficulty } from '../../data/types';
  import BoardPath from './BoardPath.svelte';
  import Checkpoint from './Checkpoint.svelte';
  import PlayerMarker from './PlayerMarker.svelte';

  interface Props {
    checkpoints: CheckpointData[];
    difficulty: Difficulty;
    currentCheckpoint: number;
    onCheckpointClick: (id: number) => void;
  }

  let { checkpoints, difficulty, currentCheckpoint, onCheckpointClick }: Props = $props();

  let playerPos = $derived.by(() => {
    const cp = checkpoints.find((c) => c.id === currentCheckpoint);
    return cp ? { x: cp.x, y: cp.y } : { x: 80, y: 420 };
  });

  // Background floating organelle decorations
  const decorations = [
    { cx: 150, cy: 100, rx: 40, ry: 25, color: '#7C3AED', dur: '8s' },
    { cx: 400, cy: 80, rx: 30, ry: 30, color: '#4ADE80', dur: '12s' },
    { cx: 700, cy: 120, rx: 35, ry: 20, color: '#FF6B6B', dur: '10s' },
    { cx: 850, cy: 450, rx: 25, ry: 25, color: '#4EA8DE', dur: '9s' },
    { cx: 200, cy: 460, rx: 20, ry: 30, color: '#F472B6', dur: '11s' },
    { cx: 550, cy: 450, rx: 45, ry: 22, color: '#FFB938', dur: '7s' },
    { cx: 800, cy: 180, rx: 18, ry: 18, color: '#C4B5FD', dur: '14s' },
    { cx: 300, cy: 200, rx: 22, ry: 35, color: '#8B5CF6', dur: '13s' },
  ];
</script>

<svg
  viewBox="0 0 960 500"
  width="100%"
  preserveAspectRatio="xMidYMid meet"
  xmlns="http://www.w3.org/2000/svg"
  class="game-board"
>
  <defs>
    <!-- Radial gradient overlay for depth -->
    <radialGradient id="bg-gradient" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="#2D1B69" stop-opacity="0.4" />
      <stop offset="100%" stop-color="#1A1A2E" stop-opacity="0" />
    </radialGradient>
  </defs>

  <!-- Dark background -->
  <rect width="960" height="500" fill="#1A1A2E" />

  <!-- Radial gradient overlay -->
  <rect width="960" height="500" fill="url(#bg-gradient)" />

  <!-- Floating organelle background decorations -->
  {#each decorations as deco}
    <ellipse
      cx={deco.cx}
      cy={deco.cy}
      rx={deco.rx}
      ry={deco.ry}
      fill={deco.color}
      opacity="0.06"
    >
      <animate
        attributeName="cx"
        values="{deco.cx};{deco.cx + 20};{deco.cx}"
        dur={deco.dur}
        repeatCount="indefinite"
      />
      <animate
        attributeName="cy"
        values="{deco.cy};{deco.cy - 15};{deco.cy}"
        dur={deco.dur}
        repeatCount="indefinite"
      />
      <animate
        attributeName="opacity"
        values="0.06;0.1;0.06"
        dur={deco.dur}
        repeatCount="indefinite"
      />
    </ellipse>
  {/each}

  <!-- Winding path -->
  <BoardPath {difficulty} {checkpoints} />

  <!-- Checkpoint nodes -->
  {#each checkpoints as cp (cp.id)}
    <Checkpoint
      x={cp.x}
      y={cp.y}
      state={cp.state}
      organelle={cp.organelle}
      id={cp.id}
      onclick={onCheckpointClick}
    />
  {/each}

  <!-- Player marker -->
  <PlayerMarker x={playerPos.x} y={playerPos.y} />
</svg>

<style>
  .game-board {
    display: block;
    max-width: 100%;
    height: auto;
    border-radius: 12px;
    overflow: hidden;
  }
</style>
