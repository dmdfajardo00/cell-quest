<script lang="ts">
  import Nucleon from '../components/mascot/Nucleon.svelte';
  import BlobButton from '../components/ui/BlobButton.svelte';
  import { game, setPlayerName, setDifficulty, startGame, resumeGame } from '../state/gameState.svelte';
  import { initAudio } from '../audio/soundManager';
  import type { Difficulty } from '../data/types';

  interface Props {
    hasSavedGame?: boolean;
  }

  let { hasSavedGame = false }: Props = $props();

  let nameInput = $state(game.player.name || '');
  let resuming = $state(false);

  const difficulties: { value: Difficulty; label: string; color: string; bg: string }[] = [
    { value: 'easy', label: 'Easy', color: '#28A745', bg: '#E8FAEB' },
    { value: 'moderate', label: 'Moderate', color: '#D49A00', bg: '#FFF8E8' },
    { value: 'difficult', label: 'Difficult', color: '#D04040', bg: '#FFF0F0' },
  ];

  function handleStart() {
    initAudio();
    if (!nameInput.trim()) return;
    setPlayerName(nameInput.trim());
    startGame();
  }

  async function handleResume() {
    initAudio();
    resuming = true;
    const ok = await resumeGame();
    if (!ok) {
      // Snapshot was invalid, just start fresh
      handleStart();
    }
    resuming = false;
  }

  function selectDiff(d: Difficulty) {
    setDifficulty(d);
  }
</script>

<div class="start-screen">
  <!-- Background blobs -->
  <div class="bg-blob blob-1"></div>
  <div class="bg-blob blob-2"></div>
  <div class="bg-blob blob-3"></div>

  <div class="content">
    <!-- Left column: mascot + title -->
    <div class="col-left">
      <h1 class="title">
        <span class="title-cell">CELL</span>
        <span class="title-quest">QUEST</span>
      </h1>
      <p class="subtitle">EXPLORE THE CELL</p>
      <div class="mascot-area">
        <Nucleon expression="idle" message="Enter your name and pick a difficulty!" size="sm" />
      </div>
    </div>

    <!-- Right column: form -->
    <div class="col-right">
      <!-- Name input -->
      <div class="input-group">
        <label class="input-label" for="player-name">Your Name</label>
        <input
          id="player-name"
          type="text"
          class="name-input"
          placeholder="Enter your name..."
          bind:value={nameInput}
          maxlength={20}
          onkeydown={(e) => e.key === 'Enter' && handleStart()}
        />
      </div>

      <!-- Difficulty selection -->
      <div class="diff-section">
        <span class="input-label">Difficulty</span>
        <div class="diff-row">
          {#each difficulties as d}
            <button
              class="diff-pill"
              class:active={game.difficulty === d.value}
              style="--d-color: {d.color}; --d-bg: {d.bg};"
              onclick={() => selectDiff(d.value)}
            >
              {d.label}
            </button>
          {/each}
        </div>
      </div>

      <!-- Start / Resume buttons -->
      <div class="start-btn-area">
        <BlobButton onclick={handleStart} disabled={!nameInput.trim()} size="lg">
          {hasSavedGame ? 'New Game' : 'Start Cell Quest'}
        </BlobButton>
        {#if hasSavedGame}
          <BlobButton onclick={handleResume} variant="secondary" size="lg" disabled={resuming}>
            Resume Game
          </BlobButton>
        {/if}
      </div>
    </div>
  </div>
</div>

<style>
  .start-screen {
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
    padding-top: env(safe-area-inset-top, 0px);
    padding-bottom: env(safe-area-inset-bottom, 0px);
  }

  .bg-blob {
    position: absolute;
    border-radius: 50% 45% 55% 48% / 48% 52% 46% 54%;
    opacity: 0.06;
    animation: blobFloat 12s ease-in-out infinite;
  }

  .blob-1 {
    width: 160px;
    height: 160px;
    background: var(--purple);
    top: -30px;
    left: -40px;
  }

  .blob-2 {
    width: 120px;
    height: 120px;
    background: var(--coral);
    bottom: -20px;
    right: -20px;
    animation-delay: -4s;
  }

  .blob-3 {
    width: 140px;
    height: 140px;
    background: var(--sky);
    top: 60%;
    left: 70%;
    animation-delay: -8s;
  }

  .content {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 32px;
    max-width: 620px;
    width: 92%;
    animation: fadeUp 0.7s ease-out;
  }

  .col-left {
    flex: 0 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    min-width: 180px;
    max-width: 220px;
  }

  .col-right {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .title {
    font-family: var(--font-display);
    font-size: clamp(28px, 6vw, 48px);
    font-weight: 700;
    line-height: 1;
    margin-bottom: 2px;
  }

  .title-cell {
    color: var(--text-on-dark);
  }

  .title-quest {
    color: var(--purple-bright);
    text-shadow: 0 0 40px rgba(139, 92, 246, 0.3);
  }

  .subtitle {
    font-family: var(--font-body);
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: var(--text-on-dark-secondary);
    margin-bottom: 12px;
    opacity: 0.7;
  }

  .mascot-area {
    display: flex;
    justify-content: center;
  }

  .input-group {
    margin-bottom: 10px;
    text-align: left;
  }

  .input-label {
    display: block;
    font-family: var(--font-body);
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--text-on-dark-secondary);
    margin-bottom: 4px;
  }

  .name-input {
    width: 100%;
    padding: 10px 14px;
    min-height: 44px;
    border-radius: 12px;
    border: 2px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.05);
    color: var(--text-on-dark);
    font-family: var(--font-body);
    font-size: 15px;
    font-weight: 500;
    outline: none;
    transition: border-color 0.2s ease;
    box-sizing: border-box;
  }

  .name-input::placeholder {
    color: var(--text-on-dark-secondary);
    opacity: 0.5;
  }

  .name-input:focus {
    border-color: var(--purple-bright);
    box-shadow: 0 0 20px rgba(139, 92, 246, 0.15);
  }

  .diff-section {
    margin-bottom: 12px;
    text-align: left;
  }

  .diff-row {
    display: flex;
    gap: 6px;
  }

  .diff-pill {
    flex: 1;
    padding: 8px 10px;
    min-height: 44px;
    border-radius: 10px;
    border: 2px solid rgba(255, 255, 255, 0.08);
    background: rgba(255, 255, 255, 0.04);
    font-family: var(--font-display);
    font-size: 13px;
    font-weight: 600;
    color: var(--text-on-dark-secondary);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .diff-pill:hover {
    border-color: var(--d-color);
    color: var(--d-color);
  }

  .diff-pill.active {
    background: var(--d-bg);
    border-color: var(--d-color);
    color: var(--d-color);
  }

  .start-btn-area {
    margin-top: 4px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
</style>
