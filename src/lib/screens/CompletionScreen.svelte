<script lang="ts">
  import Nucleon from '../components/mascot/Nucleon.svelte';
  import BlobButton from '../components/ui/BlobButton.svelte';
  import { play } from '../audio/soundManager';
  import {
    game,
    getStarRating,
    getMaxPossibleScore,
    getIncorrectCount,
    replay,
    backToStart,
    getScoreHistory,
  } from '../state/gameState.svelte';

  let stars = $derived(getStarRating());
  let maxScore = $derived(getMaxPossibleScore());
  let showHistory = $state(false);
  let scoreHistory = $derived(getScoreHistory());
  let confettiActive = $state(true);

  $effect(() => {
    const s = stars;
    for (let i = 0; i < s; i++) {
      setTimeout(() => play('starDing', i * 300), 600 + i * 300);
    }
    // Play confetti bursts
    setTimeout(() => play('confetti'), 200);
    setTimeout(() => play('confetti'), 800);
    setTimeout(() => play('confetti'), 1400);

    // Stop confetti animation after 6 seconds
    const timer = setTimeout(() => { confettiActive = false; }, 6000);
    return () => clearTimeout(timer);
  });
</script>

<div class="completion-screen">
  <!-- Confetti -->
  {#if confettiActive}
    <div class="confetti-container" aria-hidden="true">
      {#each Array(40) as _, i}
        <div
          class="confetti-piece"
          style="
            left: {Math.random() * 100}%;
            animation-delay: {Math.random() * 2}s;
            animation-duration: {2 + Math.random() * 2}s;
            background: {['#7C3AED', '#FFB938', '#FF6B6B', '#4EA8DE', '#4ADE80', '#A78BFA', '#F472B6'][i % 7]};
            width: {6 + Math.random() * 6}px;
            height: {6 + Math.random() * 6}px;
            border-radius: {Math.random() > 0.5 ? '50%' : '2px'};
          "
        ></div>
      {/each}
    </div>
  {/if}

  <div class="bg-blob blob-1"></div>
  <div class="bg-blob blob-2"></div>
  <div class="bg-blob blob-3"></div>

  <div class="content">
    <!-- Top: mascot + congrats -->
    <div class="hero">
      <div class="mascot-area">
        <Nucleon expression="celebrating" size="md" />
      </div>

      <div class="congrats-text">
        <h1 class="title">Congratulations!</h1>

        <!-- Star rating -->
        <div class="stars">
          {#each [1, 2, 3] as n}
            <svg
              width="36"
              height="36"
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

        <p class="message">
          You have successfully completed the activity. Great job applying your reading comprehension and critical thinking skills. Keep up the excellent work!
        </p>
      </div>
    </div>

    <!-- Bottom: score + actions -->
    <div class="bottom-row">
      <!-- Score card -->
      <div class="score-card">
        <div class="score-main">
          <span class="score-label">Final Score</span>
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
            <span class="detail-label">Hints</span>
            <span class="detail-value">{game.hintsUsedTotal}</span>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="actions">
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
  .completion-screen {
    width: 100%;
    height: 100%;
    background: var(--dark-bg);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow-x: hidden;
    overflow-y: auto;
    padding-left: env(safe-area-inset-left, 0px);
    padding-right: env(safe-area-inset-right, 0px);
  }

  /* Confetti */
  .confetti-container {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 10;
    overflow: hidden;
  }

  .confetti-piece {
    position: absolute;
    top: -10px;
    animation: confettiFall linear forwards;
    opacity: 0.9;
  }

  @keyframes confettiFall {
    0% {
      transform: translateY(0) rotate(0deg) scale(1);
      opacity: 1;
    }
    50% {
      opacity: 0.8;
    }
    100% {
      transform: translateY(calc(100vh + 20px)) rotate(720deg) scale(0.3);
      opacity: 0;
    }
  }

  /* Background blobs */
  .bg-blob {
    position: absolute;
    border-radius: 50% 45% 55% 48% / 48% 52% 46% 54%;
    opacity: 0.08;
    animation: blobFloat 12s ease-in-out infinite;
  }

  .blob-1 {
    width: 200px;
    height: 200px;
    background: var(--purple);
    top: -50px;
    right: -40px;
  }

  .blob-2 {
    width: 160px;
    height: 160px;
    background: var(--gold);
    bottom: -40px;
    left: -30px;
    animation-delay: -5s;
  }

  .blob-3 {
    width: 120px;
    height: 120px;
    background: var(--coral);
    top: 40%;
    left: 50%;
    animation-delay: -8s;
  }

  .content {
    position: relative;
    z-index: 2;
    width: 100%;
    max-width: 800px;
    padding: 8px 20px;
    animation: fadeUp 0.6s ease-out;
  }

  .hero {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 16px;
    margin-bottom: 8px;
  }

  .mascot-area {
    flex-shrink: 0;
  }

  .congrats-text {
    flex: 1;
    text-align: center;
  }

  .title {
    font-family: var(--font-display);
    font-size: 24px;
    font-weight: 700;
    color: var(--gold);
    margin-bottom: 4px;
    text-shadow: 0 0 20px rgba(255, 185, 56, 0.3);
    animation: celebratePulse 2s ease-in-out infinite;
  }

  @keyframes celebratePulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.03); }
  }

  .stars {
    display: flex;
    justify-content: center;
    gap: 6px;
    margin-bottom: 6px;
  }

  .star.earned {
    filter: drop-shadow(0 0 10px rgba(255, 185, 56, 0.5));
    animation: scorePop 0.5s ease-out;
  }

  .star.empty {
    opacity: 0.3;
  }

  .message {
    font-family: var(--font-body);
    font-size: 12px;
    font-weight: 500;
    color: var(--text-on-dark-secondary);
    line-height: 1.5;
    max-width: 400px;
    margin: 0 auto;
  }

  .bottom-row {
    display: flex;
    flex-direction: row;
    gap: 12px;
    align-items: stretch;
  }

  .score-card {
    flex: 1;
    background: rgba(255, 255, 255, 0.05);
    border: 1.5px solid rgba(255, 185, 56, 0.2);
    border-radius: 14px;
    padding: 10px 14px;
  }

  .score-main {
    margin-bottom: 6px;
    padding-bottom: 6px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    text-align: center;
  }

  .score-label {
    display: block;
    font-family: var(--font-body);
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--text-on-dark-secondary);
    margin-bottom: 1px;
  }

  .score-value {
    display: block;
    font-family: var(--font-display);
    font-size: 30px;
    font-weight: 700;
    color: var(--gold);
    line-height: 1.1;
  }

  .score-max {
    font-family: var(--font-body);
    font-size: 11px;
    color: var(--text-on-dark-secondary);
  }

  .score-details {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 4px;
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
    font-size: 14px;
    font-weight: 600;
    color: var(--text-on-dark);
  }

  .detail-value.correct { color: #4ADE80; }
  .detail-value.incorrect { color: var(--coral); }

  .actions {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-width: 160px;
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
    width: 100%;
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
    max-height: 100px;
    overflow-y: auto;
  }

  .history-title {
    font-family: var(--font-body);
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 3px;
    color: var(--text-on-dark-secondary);
    margin-bottom: 6px;
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
    padding: 4px 8px;
    border-radius: 6px;
    background: rgba(255, 255, 255, 0.03);
    margin-bottom: 3px;
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

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes scorePop {
    0% { transform: scale(1); }
    50% { transform: scale(1.3); }
    100% { transform: scale(1); }
  }
</style>
