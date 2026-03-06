<script lang="ts">
  import BlobButton from './BlobButton.svelte';
  import type { ScoreHistoryEntry } from '../../data/types';

  interface Props {
    playerName: string;
    completedLevels: string[];
    scoreHistory: ScoreHistoryEntry[];
    onSaveName: (name: string) => void;
    onClearData: () => void;
    onClose: () => void;
  }

  let { playerName, completedLevels, scoreHistory, onSaveName, onClearData, onClose }: Props = $props();

  let editName = $state(playerName);
  let showConfirmClear = $state(false);
  let nameChanged = $derived(editName.trim() !== '' && editName.trim() !== playerName);

  const levels = [
    { key: 'easy', label: 'Easy', color: '#22c55e' },
    { key: 'moderate', label: 'Moderate', color: '#FFB938' },
    { key: 'difficult', label: 'Difficult', color: '#FF6B6B' },
  ];

  function handleOverlayClick(e: MouseEvent) {
    if (e.target === e.currentTarget) onClose();
  }

  function handleSaveName() {
    if (nameChanged) {
      onSaveName(editName.trim());
    }
  }

  function handleClear() {
    showConfirmClear = false;
    onClearData();
  }

  function getBestScore(difficulty: string): ScoreHistoryEntry | null {
    const matching = scoreHistory.filter(s => s.difficulty === difficulty);
    if (matching.length === 0) return null;
    return matching.reduce((best, s) => s.score > best.score ? s : best, matching[0]);
  }
</script>

<div class="overlay" onclick={handleOverlayClick} role="presentation">
  <div class="modal-card">
    <!-- Header -->
    <div class="modal-header">
      <h2 class="modal-title">Settings</h2>
      <button class="close-btn" onclick={onClose} aria-label="Close">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>

    <div class="modal-body">
      <!-- Edit Name -->
      <section class="section">
        <h3 class="section-title">PLAYER NAME</h3>
        <div class="name-row">
          <input
            type="text"
            class="name-input"
            bind:value={editName}
            maxlength={20}
            placeholder="Your name..."
            onkeydown={(e) => e.key === 'Enter' && handleSaveName()}
          />
          {#if nameChanged}
            <button class="save-name-btn" onclick={handleSaveName}>Save</button>
          {/if}
        </div>
      </section>

      <!-- Progress -->
      <section class="section">
        <h3 class="section-title">PROGRESS</h3>
        <div class="levels-grid">
          {#each levels as level}
            {@const completed = completedLevels.includes(level.key)}
            {@const best = getBestScore(level.key)}
            <div class="level-card" class:completed>
              <div class="level-header">
                <span class="level-icon" style="color: {level.color};">
                  {#if completed}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
                  {:else}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" opacity="0.4"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2z"/></svg>
                  {/if}
                </span>
                <span class="level-name" style="color: {level.color};">{level.label}</span>
              </div>
              {#if best}
                <div class="level-best">
                  <span class="best-score">{best.score}/{best.totalPossible}</span>
                  <span class="best-stars">
                    {#each Array(best.stars) as _}
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="#FFB938"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    {/each}
                  </span>
                </div>
              {:else}
                <span class="level-not-played">Not played</span>
              {/if}
            </div>
          {/each}
        </div>
      </section>

      <!-- History -->
      {#if scoreHistory.length > 0}
        <section class="section">
          <h3 class="section-title">RECENT SCORES</h3>
          <div class="history-list">
            {#each scoreHistory.slice().reverse().slice(0, 8) as entry}
              <div class="history-row">
                <span class="h-diff" style="color: {levels.find(l => l.key === entry.difficulty)?.color ?? '#999'};">{entry.difficulty}</span>
                <span class="h-score">{entry.score}/{entry.totalPossible}</span>
                <span class="h-stars">
                  {#each Array(entry.stars) as _}
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="#FFB938"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  {/each}
                </span>
                <span class="h-date">{entry.date}</span>
              </div>
            {/each}
          </div>
        </section>
      {/if}

      <!-- Danger Zone -->
      <section class="section danger-section">
        {#if !showConfirmClear}
          <BlobButton onclick={() => showConfirmClear = true} variant="danger" size="sm">
            Clear All Data
          </BlobButton>
        {:else}
          <div class="confirm-clear">
            <p class="confirm-text">Delete all scores, progress, and saved games?</p>
            <div class="confirm-actions">
              <BlobButton onclick={handleClear} variant="danger" size="sm">
                Yes, Delete Everything
              </BlobButton>
              <button class="cancel-btn" onclick={() => showConfirmClear = false}>Cancel</button>
            </div>
          </div>
        {/if}
      </section>
    </div>
  </div>
</div>

<style>
  .overlay {
    position: fixed;
    inset: 0;
    padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
    background: rgba(26, 26, 46, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 200;
    animation: fadeIn 0.2s ease-out;
  }

  .modal-card {
    background: var(--light-surface);
    max-width: 480px;
    width: 92%;
    max-height: 90vh;
    overflow-y: auto;
    border-radius: 20px;
    box-shadow: 0 24px 80px rgba(0, 0, 0, 0.25);
    animation: fadeUp 0.3s ease-out;
  }

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px 0;
  }

  .modal-title {
    font-family: var(--font-display);
    font-size: 22px;
    font-weight: 700;
    color: var(--text-dark);
  }

  .close-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    border: none;
    background: var(--light-bg);
    color: var(--text-light);
    cursor: pointer;
    transition: all 0.15s;
  }

  .close-btn:hover {
    background: var(--coral-bg);
    color: var(--coral);
  }

  .modal-body {
    padding: 16px 24px 24px;
  }

  .section {
    margin-bottom: 20px;
  }

  .section:last-child {
    margin-bottom: 0;
  }

  .section-title {
    font-family: var(--font-body);
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: var(--text-light);
    margin-bottom: 8px;
  }

  /* Name input */
  .name-row {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .name-input {
    flex: 1;
    padding: 10px 14px;
    min-height: 44px;
    border-radius: 12px;
    border: 2px solid var(--light-border);
    background: var(--light-bg);
    color: var(--text-dark);
    font-family: var(--font-body);
    font-size: 15px;
    font-weight: 500;
    outline: none;
    transition: border-color 0.2s;
    box-sizing: border-box;
  }

  .name-input:focus {
    border-color: var(--purple);
  }

  .save-name-btn {
    padding: 10px 18px;
    min-height: 44px;
    border-radius: 12px;
    border: none;
    background: var(--purple);
    color: #FFF;
    font-family: var(--font-display);
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 3px 0 var(--purple-dark);
    transition: all 0.15s;
  }

  .save-name-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 0 var(--purple-dark);
  }

  .save-name-btn:active {
    transform: translateY(1px);
    box-shadow: 0 1px 0 var(--purple-dark);
  }

  /* Progress levels */
  .levels-grid {
    display: flex;
    gap: 8px;
  }

  .level-card {
    flex: 1;
    padding: 12px;
    border-radius: 12px;
    border: 1.5px solid var(--light-border);
    background: var(--light-bg);
    text-align: center;
  }

  .level-card.completed {
    border-color: rgba(34, 197, 94, 0.2);
    background: rgba(34, 197, 94, 0.04);
  }

  .level-header {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    margin-bottom: 6px;
  }

  .level-icon {
    display: flex;
    align-items: center;
  }

  .level-name {
    font-family: var(--font-display);
    font-size: 13px;
    font-weight: 600;
    text-transform: capitalize;
  }

  .level-best {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }

  .best-score {
    font-family: var(--font-display);
    font-size: 13px;
    font-weight: 600;
    color: var(--text-dark);
  }

  .best-stars {
    display: flex;
    gap: 1px;
  }

  .level-not-played {
    font-family: var(--font-body);
    font-size: 11px;
    color: var(--text-light);
  }

  /* History */
  .history-list {
    max-height: 120px;
    overflow-y: auto;
    border-radius: 10px;
    border: 1px solid var(--light-border);
  }

  .history-row {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 6px 12px;
    border-bottom: 1px solid var(--light-border);
  }

  .history-row:last-child {
    border-bottom: none;
  }

  .h-diff {
    font-family: var(--font-display);
    font-size: 12px;
    font-weight: 600;
    text-transform: capitalize;
    min-width: 65px;
  }

  .h-score {
    font-family: var(--font-display);
    font-size: 12px;
    font-weight: 600;
    color: var(--text-dark);
  }

  .h-stars {
    display: flex;
    gap: 1px;
  }

  .h-date {
    margin-left: auto;
    font-family: var(--font-body);
    font-size: 11px;
    color: var(--text-light);
  }

  /* Danger zone */
  .danger-section {
    padding-top: 16px;
    border-top: 1px solid var(--light-border);
  }

  .confirm-clear {
    background: var(--coral-bg);
    border: 1.5px solid rgba(255, 107, 107, 0.2);
    border-radius: 12px;
    padding: 14px;
    text-align: center;
  }

  .confirm-text {
    font-family: var(--font-body);
    font-size: 13px;
    font-weight: 600;
    color: var(--coral);
    margin-bottom: 10px;
  }

  .confirm-actions {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }

  .cancel-btn {
    padding: 8px 16px;
    border-radius: 10px;
    border: none;
    background: transparent;
    color: var(--text-mid);
    font-family: var(--font-display);
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
  }

  .cancel-btn:hover {
    color: var(--text-dark);
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to { opacity: 1; transform: translateY(0); }
  }
</style>
