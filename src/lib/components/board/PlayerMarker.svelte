<script lang="ts">
  interface Props {
    x: number;
    y: number;
  }

  let { x, y }: Props = $props();
</script>

<g transform="translate({x}, {y})" class="player-marker">
  <defs>
    <filter id="player-glow">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>

  <!-- Drop shadow / glow -->
  <circle r="14" fill="#A78BFA" opacity="0.3" filter="url(#player-glow)" />

  <!-- Main blob -->
  <circle r="14" fill="#7C3AED" opacity="0.9">
    <!-- Wiggle animation -->
    <animate attributeName="r" values="13;15;13" dur="1.2s" repeatCount="indefinite" />
  </circle>

  <!-- Inner highlight -->
  <circle r="6" fill="#C4B5FD" opacity="0.6" cx="-3" cy="-3">
    <animate attributeName="cx" values="-3;-2;-3" dur="1.2s" repeatCount="indefinite" />
    <animate attributeName="cy" values="-3;-4;-3" dur="1.2s" repeatCount="indefinite" />
  </circle>

  <!-- Bounce animation on position change via CSS transition on parent -->
  <animateTransform
    attributeName="transform"
    type="scale"
    values="0.5;1.15;0.95;1"
    dur="0.5s"
    begin="0s"
    fill="freeze"
    keyTimes="0;0.4;0.7;1"
  />
</g>

<style>
  .player-marker {
    transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
</style>
