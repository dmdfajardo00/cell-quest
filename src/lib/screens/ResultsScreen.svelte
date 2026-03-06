<script lang="ts">
  import Nucleon from '../components/mascot/Nucleon.svelte';
  import BlobButton from '../components/ui/BlobButton.svelte';
  import { play } from '../audio/soundManager';
  import {
    game,
    getStarRating,
    getMaxPossibleScore,
    getIncorrectCount,
    hasNextLevel,
    nextLevel,
    replay,
    backToStart,
    getScoreHistory,
  } from '../state/gameState.svelte';

  let stars = $derived(getStarRating());
  let maxScore = $derived(getMaxPossibleScore());
  let scoreHistory = $derived(getScoreHistory());
  let showHistory = $state(false);

  $effect(() => {
    const s = stars;
    for (let i = 0; i < s; i++) {
      setTimeout(() => play('starDing', i * 300), 400 + i * 300);
    }
  });
</script>

<div class="results-screen">
  <div class="bg-blob blob-1"></div>
  <div class="bg-blob blob-2"></div>

  <div class="content">
    <div class="two-col">
      <!-- Left column: mascot + title + stars -->
      <div class="col-left">
        <div class="mascot-area">
          <Nucleon expression="celebrating" message="Show your score to your teacher!" size="md" />
        </div>

        <h1 class="title">Level Complete!</h1>
        <p class="subtitle">{game.difficulty.charAt(0).toUpperCase() + game.difficulty.slice(1)} Level</p>

        <!-- Star rating -->
        <div class="stars">
          {#each [1, 2, 3] as n}
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              class="star"
              class:earned={n <= stars}
              class:empty={n > stars}
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z"
                fill={n <= stars ? '#FFB938' : 'rgba(255,255,255,0.1)'}
                stroke={n <= stars ? '#E6A020' : 'rgba(255,255,255,0.08)'}
                stroke-width="0.5"
              />
            </svg>
          {/each}
        </div>
      </div>

      <!-- Right column: score card + actions -->
      <div class="col-right">
        <!-- Score card -->
        <div class="score-card">
          <div class="score-main">
            <span class="score-label">Total Score</span>
            <span class="score-value">{game.player.score}</span>
            <span class="score-max">of {maxScore} possible</span>
          </div>

          <div class="score-details">
            <div class="detail">
              <span class="detail-label">Player</span>
              <span class="detail-value">{game.player.name}</span>
            </div>
            <div class="detail">
              <span class="detail-label">Correct</span>
              <span class="detail-value correct">{game.questionsCorrect}/{game.checkpoints.length}</span>
            </div>
            <div class="detail">
              <span class="detail-label">Incorrect</span>
              <span class="detail-value incorrect">{getIncorrectCount()}</span>
            </div>
            <div class="detail">
              <span class="detail-label">Hints Used</span>
              <span class="detail-value">{game.hintsUsedTotal}</span>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="actions">
          {#if hasNextLevel()}
            <BlobButton onclick={nextLevel} size="lg">
              Play Next Level
            </BlobButton>
          {/if}
          <BlobButton onclick={replay} variant="secondary" size="md">
            Play Again
          </BlobButton>
          <button class="btn-history" onclick={() => showHistory = !showHistory}>
            {showHistory ? 'Hide' : 'View'} Score History
          </button>
          <button class="btn-back" onclick={backToStart}>
            Back to Menu
          </button>
        </div>
      </div>
    </div>

    <!-- Score history -->
    {#if showHistory}
      <div class="history-panel">
        <h3 class="history-title">SCORE HISTORY</h3>
        {#if scoreHistory.length === 0}
          <p class="history-empty">No previous scores yet.</p>
        {:else}
          {#each scoreHistory.slice().reverse().slice(0, 10) as entry}
            <div class="history-row">
              <div class="history-left">
                <span class="history-name">{entry.name}</span>
                <span class="history-diff">{entry.difficulty}</span>
              </div>
              <div class="history-right">
                <span class="history-score">{entry.score}/{entry.totalPossible}</span>
                <span class="history-date">{entry.date}</span>
                <span class="history-stars">
                  {#each Array(entry.stars) as _}
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="#FFB938"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  {/each}
                </span>
              </div>
            </div>
          {/each}
        {/if}
      </div>
    {/if}
  </div>
</div>

<style>
  .results-screen {
    width: 100%;
    height: 100%;
    background: var(--dark-bg);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    padding-left: env(safe-area-inset-left, 0px);
    padding-right: env(safe-area-inset-right, 0px);
  }

  .bg-blob {
    position: absolute;
    border-radius: 50% 45% 55% 48% / 48% 52% 46% 54%;
    opacity: 0.06;
    animation: blobFloat 12s ease-in-out infinite;
  }

  .blob-1 {
    width: 180px;
    height: 180px;
    background: var(--purple);
    top: -40px;
    right: -30px;
  }

  .blob-2 {
    width: 140px;
    height: 140px;
    background: var(--gold);
    bottom: -30px;
    left: -30px;
    animation-delay: -5s;
  }

  .content {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 700px;
    padding: 12px 16px;
    animation: fadeUp 0.6s ease-out;
  }

  .two-col {
    display: flex;
    flex-direction: row;
    gap: 20px;
    align-items: center;
  }

  .col-left {
    flex: 0 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    min-width: 180px;
  }

  .col-right {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .mascot-area {
    margin-bottom: 8px;
    display: flex;
    justify-content: center;
  }

  .title {
    font-family: var(--font-display);
    font-size: 24px;
    font-weight: 700;
    color: var(--text-on-dark);
    margin-bottom: 2px;
  }

  .subtitle {
    font-family: var(--font-body);
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--purple-light);
    margin-bottom: 8px;
  }

  .stars {
    display: flex;
    justify-content: center;
    gap: 6px;
    margin-bottom: 0;
  }

  .star.earned {
    filter: drop-shadow(0 0 8px rgba(255, 185, 56, 0.4));
    animation: scorePop 0.5s ease-out;
  }

  .star.empty {
    opacity: 0.3;
  }

  .score-card {
    background: rgba(255, 255, 255, 0.05);
    border: 1.5px solid rgba(255, 255, 255, 0.08);
    border-radius: 16px;
    padding: 16px;
    margin-bottom: 12px;
  }

  .score-main {
    margin-bottom: 12px;
    padding-bottom: 10px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    text-align: center;
  }

  .score-label {
    display: block;
    font-family: var(--font-body);
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--text-on-dark-secondary);
    margin-bottom: 2px;
  }

  .score-value {
    display: block;
    font-family: var(--font-display);
    font-size: 36px;
    font-weight: 700;
    color: var(--gold);
    line-height: 1.1;
  }

  .score-max {
    font-family: var(--font-body);
    font-size: 12px;
    color: var(--text-on-dark-secondary);
  }

  .score-details {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }

  .detail {
    text-align: center;
  }

  .detail-label {
    display: block;
    font-family: var(--font-body);
    font-size: 10px;
    font-weight: 600;
    color: var(--text-on-dark-secondary);
    margin-bottom: 1px;
  }

  .detail-value {
    font-family: var(--font-display);
    font-size: 15px;
    font-weight: 600;
    color: var(--text-on-dark);
  }

  .detail-value.correct { color: #4ADE80; }
  .detail-value.incorrect { color: var(--coral); }

  .actions {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .btn-history {
    font-family: var(--font-display);
    font-size: 13px;
    font-weight: 600;
    padding: 10px 18px;
    min-height: 44px;
    border-radius: 12px;
    border: 2px solid rgba(255, 255, 255, 0.1);
    background: transparent;
    color: var(--text-on-dark-secondary);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .btn-history:hover {
    border-color: var(--purple-light);
    color: var(--purple-light);
  }

  .btn-back {
    font-family: var(--font-body);
    font-size: 13px;
    font-weight: 600;
    padding: 10px 18px;
    min-height: 44px;
    border-radius: 10px;
    border: none;
    background: transparent;
    color: var(--text-on-dark-secondary);
    cursor: pointer;
    opacity: 0.7;
    transition: opacity 0.2s;
  }

  .btn-back:hover {
    opacity: 1;
  }

  .history-panel {
    margin-top: 12px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 12px;
    padding: 12px;
    text-align: left;
    max-height: 120px;
    overflow-y: auto;
  }

  .history-title {
    font-family: var(--font-body);
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 3px;
    color: var(--text-on-dark-secondary);
    margin-bottom: 8px;
  }

  .history-empty {
    font-family: var(--font-body);
    font-size: 13px;
    color: var(--text-on-dark-secondary);
    text-align: center;
    padding: 8px;
  }

  .history-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 10px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.03);
    margin-bottom: 4px;
  }

  .history-row:last-child { margin-bottom: 0; }

  .history-left {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .history-name {
    font-family: var(--font-display);
    font-size: 13px;
    font-weight: 600;
    color: var(--text-on-dark);
  }

  .history-diff {
    font-family: var(--font-body);
    font-size: 11px;
    font-weight: 600;
    color: var(--text-on-dark-secondary);
    text-transform: capitalize;
  }

  .history-right {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .history-score {
    font-family: var(--font-display);
    font-size: 13px;
    font-weight: 600;
    color: var(--gold);
  }

  .history-date {
    font-family: var(--font-body);
    font-size: 11px;
    color: var(--text-on-dark-secondary);
  }

  .history-stars {
    display: flex;
    gap: 2px;
  }
</style>
