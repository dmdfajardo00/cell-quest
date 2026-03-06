<script>
  import { initAudio, toggleMute, isMuted } from '../../audio/soundManager';

  let muted = $state(isMuted());

  function handleToggleMute() {
    muted = toggleMute();
  }

  let {
    playerName,
    score,
    progress,
    difficulty,
    completedCount,
    totalCount,
    onNameClick
  } = $props();

  const difficultyColors = {
    easy: '#22c55e',
    moderate: '#FFB938',
    difficult: '#FF6B6B'
  };
</script>

<header class="topbar">
  <div class="left">
    <button class="player-name-btn" onclick={onNameClick} aria-label="Open settings">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.5">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
      </svg>
      {playerName}
    </button>
    <span class="difficulty-badge" style="background: {difficultyColors[difficulty]}20; color: {difficultyColors[difficulty]}; border: 1.5px solid {difficultyColors[difficulty]}40;">
      {difficulty}
    </span>
  </div>

  <div class="center">
    <span class="progress-label">{completedCount}/{totalCount} Checkpoints</span>
    <div class="progress-track">
      <div class="progress-fill" style="width: {progress}%;"></div>
    </div>
  </div>

  <div class="right">
    <button class="mute-btn" onclick={handleToggleMute} aria-label={muted ? 'Unmute' : 'Mute'}>
      {#if muted}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>
        </svg>
      {:else}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
        </svg>
      {/if}
    </button>
    <span class="points-badge">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--gold)">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
      {score} pts
    </span>
  </div>
</header>

<style>
  .topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: var(--dark-bg);
    padding: 4px 12px;
    padding-left: max(12px, env(safe-area-inset-left));
    padding-right: max(12px, env(safe-area-inset-right));
    gap: 10px;
    max-height: 40px;
    box-sizing: border-box;
  }

  .left {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .player-name-btn {
    display: flex;
    align-items: center;
    gap: 5px;
    font-family: var(--font-display);
    color: var(--text-on-dark);
    font-size: 13px;
    font-weight: 600;
    background: none;
    border: 1.5px solid transparent;
    border-radius: 8px;
    padding: 3px 8px;
    cursor: pointer;
    transition: all 0.15s;
  }

  .player-name-btn:hover {
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(255, 255, 255, 0.12);
  }

  .difficulty-badge {
    font-family: var(--font-body);
    font-size: 10px;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: 999px;
    text-transform: capitalize;
  }

  .center {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
  }

  .progress-label {
    font-family: var(--font-body);
    font-size: 10px;
    color: var(--text-on-dark-secondary);
  }

  .progress-track {
    width: 150px;
    max-width: 150px;
    height: 6px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 999px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--purple), var(--purple-light));
    border-radius: 999px;
    transition: width 0.6s ease;
  }

  .right {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .mute-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 6px;
    border: 1px solid var(--dark-border);
    background: transparent;
    color: var(--text-on-dark-secondary);
    cursor: pointer;
    padding: 0;
    transition: color 0.2s;
  }
  .mute-btn:hover {
    color: var(--text-on-dark);
  }

  .points-badge {
    display: flex;
    align-items: center;
    gap: 4px;
    font-family: var(--font-display);
    font-size: 12px;
    font-weight: 600;
    color: var(--gold);
    background: rgba(255, 185, 56, 0.12);
    padding: 3px 10px;
    border-radius: 999px;
  }
</style>
