<script lang="ts">
  import NucleonFace from './NucleonFace.svelte';

  let {
    expression = 'idle',
    message = '',
    size = 'md'
  }: {
    expression?: 'happy' | 'thinking' | 'concerned' | 'celebrating' | 'idle';
    message?: string;
    size?: 'xs' | 'sm' | 'md' | 'lg';
  } = $props();

  const sizes = { xs: 50, sm: 80, md: 120, lg: 240 } as const;

  let containerSize = $derived(sizes[size]);
  let bodySize = $derived(Math.round(containerSize * 0.46));
  let fontSize = $derived(size === 'xs' ? 6 : size === 'sm' ? 8 : size === 'md' ? 14 : 24);
</script>

<div class="nucleon-wrapper {size}">
  <div
    class="nucleon-container"
    style="width: {containerSize}px; height: {containerSize}px;"
  >
    <!-- Orbit rings -->
    <div class="orbit-ring inner"></div>
    <div class="orbit-ring outer"></div>

    <!-- Orbiting organelles -->
    <div class="orb cyan" style="--orbit-r: {size === 'xs' ? 22 : size === 'sm' ? 35 : size === 'md' ? 65 : 125}px;">
      <div class="orb-inner"></div>
    </div>
    <div class="orb pink" style="--orbit-r: {size === 'xs' ? 22 : size === 'sm' ? 35 : size === 'md' ? 65 : 125}px;">
      <div class="orb-inner"></div>
    </div>
    <div class="orb gold" style="--orbit-r: {size === 'xs' ? 28 : size === 'sm' ? 45 : size === 'md' ? 80 : 160}px;">
      <div class="orb-inner"></div>
    </div>
    <div class="orb green" style="--orbit-r: {size === 'xs' ? 28 : size === 'sm' ? 45 : size === 'md' ? 80 : 160}px;">
      <div class="orb-inner"></div>
    </div>

    <!-- Body -->
    <div
      class="nucleon-body"
      class:celebrating={expression === 'celebrating'}
      style="width: {bodySize}px; height: {bodySize}px; font-size: {fontSize}px;"
    >
      <NucleonFace {expression} />
    </div>
  </div>

  <!-- Speech bubble -->
  {#if message}
    <div class="speech-bubble {size}">
      <p>{message}</p>
    </div>
  {/if}
</div>

<style>
  .nucleon-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  .nucleon-container {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Orbit rings */
  .orbit-ring {
    position: absolute;
    border: 1.5px dashed rgba(167, 139, 250, 0.2);
    border-radius: 50%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
  }

  .xs .orbit-ring.inner { width: 44px; height: 44px; }
  .xs .orbit-ring.outer { width: 56px; height: 56px; }
  .sm .orbit-ring.inner { width: 70px; height: 70px; }
  .sm .orbit-ring.outer { width: 90px; height: 90px; }
  .md .orbit-ring.inner { width: 130px; height: 130px; }
  .md .orbit-ring.outer { width: 160px; height: 160px; }
  .lg .orbit-ring.inner { width: 250px; height: 250px; }
  .lg .orbit-ring.outer { width: 320px; height: 320px; }

  /* Nucleon body */
  .nucleon-body {
    position: relative;
    background: radial-gradient(circle at 38% 35%, #A78BFA, #7C3AED 60%, #6D28D9);
    box-shadow:
      0 0 30px rgba(124, 58, 237, 0.3),
      inset -4px -6px 12px rgba(109, 40, 217, 0.4),
      inset 4px 4px 12px rgba(167, 139, 250, 0.3);
    animation: wiggle 6s ease-in-out infinite;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
  }

  .nucleon-body.celebrating {
    animation: wiggle 6s ease-in-out infinite, celebrate-bounce 0.5s ease infinite alternate;
  }

  @keyframes celebrate-bounce {
    from { transform: translateY(0); }
    to { transform: translateY(-6px); }
  }

  /* Orbiting organelles */
  .orb {
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: calc(var(--orb-size) / -2);
    margin-left: calc(var(--orb-size) / -2);
    width: var(--orb-size);
    height: var(--orb-size);
    z-index: 1;
  }

  .orb-inner {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    animation: wiggle 4s ease-in-out infinite;
  }

  /* Cyan orb */
  .cyan {
    --orb-size: 22px;
    animation: orbit 7s linear infinite;
  }
  .xs .cyan { --orb-size: 7px; }
  .sm .cyan { --orb-size: 11px; }
  .lg .cyan { --orb-size: 32px; }
  .cyan .orb-inner {
    background: radial-gradient(circle at 35% 35%, #6FE8FF, #4EA8DE);
    box-shadow: 0 0 10px rgba(111, 232, 255, 0.4);
  }

  /* Pink orb */
  .pink {
    --orb-size: 16px;
    animation: orbit 10s linear infinite reverse;
  }
  .xs .pink { --orb-size: 5px; }
  .sm .pink { --orb-size: 8px; }
  .lg .pink { --orb-size: 24px; }
  .pink .orb-inner {
    background: radial-gradient(circle at 35% 35%, #FF9EBE, #FF6B6B);
    box-shadow: 0 0 10px rgba(255, 158, 190, 0.4);
  }

  /* Gold orb */
  .gold {
    --orb-size: 18px;
    animation: orbit 13s linear infinite;
  }
  .xs .gold { --orb-size: 6px; }
  .sm .gold { --orb-size: 9px; }
  .lg .gold { --orb-size: 26px; }
  .gold .orb-inner {
    background: radial-gradient(circle at 35% 35%, #FFD76E, #FFB938);
    box-shadow: 0 0 10px rgba(255, 215, 110, 0.4);
  }

  /* Green orb */
  .green {
    --orb-size: 14px;
    animation: orbit 16s linear infinite reverse;
  }
  .xs .green { --orb-size: 5px; }
  .sm .green { --orb-size: 7px; }
  .lg .green { --orb-size: 20px; }
  .green .orb-inner {
    background: radial-gradient(circle at 35% 35%, #6FFF9E, #4ADE80);
    box-shadow: 0 0 10px rgba(111, 255, 158, 0.4);
  }

  /* Speech bubble */
  .speech-bubble {
    background: #fff;
    border-radius: 16px;
    padding: 12px 16px;
    position: relative;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08), 0 1px 4px rgba(0, 0, 0, 0.04);
    text-align: center;
    animation: fadeUp 0.3s ease-out;
  }

  .speech-bubble::before {
    content: '';
    position: absolute;
    top: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 8px solid #fff;
  }

  .speech-bubble p {
    margin: 0;
    font-family: var(--font-body);
    color: var(--text-dark);
    line-height: 1.4;
  }

  .speech-bubble.xs {
    max-width: 180px;
    padding: 8px 12px;
  }
  .speech-bubble.xs p {
    font-size: 11px;
  }

  .speech-bubble.sm {
    max-width: 220px;
  }
  .speech-bubble.sm p {
    font-size: 13px;
  }

  .speech-bubble.md {
    max-width: 280px;
  }
  .speech-bubble.md p {
    font-size: 14px;
  }

  .speech-bubble.lg {
    max-width: 340px;
  }
  .speech-bubble.lg p {
    font-size: 15px;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }
</style>
