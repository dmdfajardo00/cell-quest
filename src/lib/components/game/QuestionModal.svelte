<script lang="ts">
  import PassageCard from './PassageCard.svelte';
  import AnswerOption from './AnswerOption.svelte';
  import FeedbackBanner from './FeedbackBanner.svelte';
  import type { Question, Difficulty } from '../../data/types';

  let {
    question,
    difficulty,
    attemptCount,
    selectedAnswer,
    showingFeedback,
    feedbackType,
    hintUnlocked = false,
    canAffordHint = true,
    playerScore = 0,
    elapsedSeconds = 0,
    lastEarnedPoints = 0,
    lastSpeedBonus = 0,
    onSelectAnswer,
    onSubmit,
    onUseHint,
    onNext,
    onTryAgain,
    onContinue,
    onClose
  }: {
    question: Question;
    difficulty: Difficulty;
    attemptCount: number;
    selectedAnswer: number | null;
    showingFeedback: boolean;
    feedbackType: string | null;
    hintUnlocked?: boolean;
    canAffordHint?: boolean;
    playerScore?: number;
    elapsedSeconds?: number;
    lastEarnedPoints?: number;
    lastSpeedBonus?: number;
    onSelectAnswer: (index: number) => void;
    onSubmit: () => void;
    onUseHint: () => void;
    onNext: () => void;
    onTryAgain: () => void;
    onContinue: () => void;
    onClose?: () => void;
  } = $props();

  function handleOverlayClick(e: MouseEvent) {
    if (e.target === e.currentTarget) {
      onClose?.();
    }
  }

  let letters = $derived(question.type === 'tf' ? ['T', 'F'] : ['A', 'B', 'C', 'D']);

  const difficultyStyles: Record<Difficulty, { bg: string; color: string }> = {
    easy: { bg: '#E8FAEB', color: '#28A745' },
    moderate: { bg: '#FFF8E8', color: '#D49A00' },
    difficult: { bg: '#FFF0F0', color: '#D04040' }
  };

  function getOptionState(index: number) {
    if (!showingFeedback || feedbackType === 'hint') {
      return selectedAnswer === index ? 'selected' : 'default';
    }
    if (feedbackType === 'correct') {
      if (index === question.correctIndex) return 'correct';
      return 'disabled';
    }
    if (feedbackType === 'wrong') {
      if (index === selectedAnswer) return 'wrong';
      return 'disabled';
    }
    return 'default';
  }

  function getFeedbackMessage() {
    if (feedbackType === 'correct') {
      if (lastSpeedBonus > 0) {
        return `${question.justification} (+5 base +${lastSpeedBonus} speed bonus = ${lastEarnedPoints} pts!)`;
      }
      return `${question.justification} (+${lastEarnedPoints} points!)`;
    }
    if (feedbackType === 'wrong' && attemptCount >= 2) {
      return question.justification;
    }
    return '';
  }

  function formatTime(secs: number) {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return m > 0 ? `${m}:${String(s).padStart(2, '0')}` : `${s}s`;
  }
</script>

<div class="overlay" onclick={handleOverlayClick} role="presentation">
  <div class="modal-card">
    <div class="modal-header">
      <span class="organelle-name">{question.organelle}</span>
      <div class="header-right">
        <span class="timer">{formatTime(elapsedSeconds)}</span>
        {#if difficultyStyles[difficulty]}
          <span
            class="difficulty-badge"
            style="background: {difficultyStyles[difficulty].bg}; color: {difficultyStyles[difficulty].color};"
          >
            {difficulty}
          </span>
        {/if}
      </div>
    </div>

    <div class="columns">
      {#if question.passage}
        <div class="col-left">
          <div class="passage-area">
            <PassageCard text={question.passage} />
          </div>
        </div>
      {/if}

      <div class="col-right" class:col-full={!question.passage}>
        <p class="question-text">{question.question}</p>

        <div class="answer-grid">
          {#each question.options as option, i}
            <AnswerOption
              text={option}
              letter={letters[i]}
              index={i}
              state={getOptionState(i)}
              onclick={onSelectAnswer}
            />
          {/each}
        </div>

        {#if !showingFeedback || feedbackType === 'hint'}
          <div class="modal-actions">
            <button
              class="btn-hint"
              onclick={onUseHint}
              disabled={!hintUnlocked && !canAffordHint}
              title={!hintUnlocked && !canAffordHint ? 'Not enough points (need 3)' : ''}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 18c0 2 1.5 3 3 3s3-1 3-3"/>
                <path d="M12 2a7 7 0 0 0-7 7c0 2.5 1 4 2.5 5.5S10 17 10 18h4c0-1 1-2.5 2.5-3.5S19 11.5 19 9a7 7 0 0 0-7-7z"/>
              </svg>
              {#if hintUnlocked}
                View Hint
              {:else}
                Use Hint (3 pts)
              {/if}
            </button>
            <button
              class="btn-submit"
              onclick={onSubmit}
              disabled={selectedAnswer === null}
            >
              Submit
            </button>
          </div>
        {/if}
      </div>
    </div>

    {#if showingFeedback && feedbackType && feedbackType !== 'hint'}
      <div class="feedback-area">
        <FeedbackBanner
          type={feedbackType as 'correct' | 'wrong' | 'hint'}
          message={getFeedbackMessage()}
          points={feedbackType === 'correct' ? lastEarnedPoints : 0}
          showNext={feedbackType === 'correct'}
          showTryAgain={feedbackType === 'wrong' && attemptCount < 2}
          showContinue={feedbackType === 'wrong' && attemptCount >= 2}
          {onNext}
          {onTryAgain}
          {onContinue}
        />
      </div>
    {/if}

    {#if showingFeedback && feedbackType === 'hint'}
      <div class="feedback-area">
        <FeedbackBanner
          type="hint"
          message={question.hint}
        />
      </div>
    {/if}
  </div>
</div>

<style>
  .overlay {
    position: fixed;
    inset: 0;
    padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
    background: rgba(26, 26, 46, 0.65);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    animation: fadeIn 0.25s ease-out;
  }

  .modal-card {
    background: #FFFFFF;
    max-width: 95vw;
    max-height: 95vh;
    width: auto;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border-radius: 16px;
    padding: 16px;
    box-shadow: 0 24px 80px rgba(0, 0, 0, 0.2);
    animation: fadeUp 0.35s ease-out;
  }

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
    flex-shrink: 0;
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .timer {
    font-family: var(--font-body);
    font-size: 13px;
    font-weight: 600;
    color: var(--text-light);
    padding: 4px 10px;
    background: var(--light-bg);
    border-radius: 8px;
  }

  .organelle-name {
    font-family: var(--font-display);
    font-size: 17px;
    font-weight: 600;
    color: var(--text-dark);
  }

  .difficulty-badge {
    font-family: var(--font-display);
    font-size: 12px;
    font-weight: 600;
    padding: 4px 14px;
    border-radius: 50px;
    text-transform: capitalize;
  }

  .columns {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    flex: 1;
    min-height: 0;
  }

  .col-left {
    overflow-y: auto;
    max-height: calc(95vh - 120px);
    min-height: 0;
  }

  .col-right {
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    max-height: calc(95vh - 120px);
    min-height: 0;
  }

  .col-right.col-full {
    grid-column: 1 / -1;
  }

  .passage-area {
    margin-bottom: 0;
  }

  .question-text {
    font-family: var(--font-display);
    font-size: 15px;
    font-weight: 500;
    color: var(--text-dark);
    line-height: 1.5;
    margin-bottom: 12px;
    flex-shrink: 0;
  }

  .answer-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 8px;
    margin-bottom: 12px;
    flex-shrink: 0;
  }

  .feedback-area {
    margin-top: 12px;
    flex-shrink: 0;
  }

  .modal-actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 12px;
    margin-top: auto;
    padding-top: 8px;
    flex-shrink: 0;
  }

  .btn-hint {
    display: flex;
    align-items: center;
    gap: 6px;
    font-family: var(--font-display);
    font-size: 14px;
    font-weight: 600;
    min-height: 44px;
    padding: 10px 20px;
    border-radius: 12px;
    border: 2px solid var(--light-border);
    background: #FFFFFF;
    color: var(--sky);
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .btn-hint:hover:not(:disabled) {
    background: var(--sky-bg);
    border-color: rgba(78, 168, 222, 0.3);
  }

  .btn-hint:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .btn-submit {
    font-family: var(--font-display);
    font-size: 15px;
    font-weight: 600;
    min-height: 44px;
    padding: 12px 32px;
    border-radius: 12px;
    border: none;
    background: var(--purple);
    color: #FFFFFF;
    cursor: pointer;
    box-shadow: 0 4px 0 var(--purple-dark);
    transition: all 0.15s ease;
  }

  .btn-submit:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 5px 0 var(--purple-dark);
  }

  .btn-submit:active:not(:disabled) {
    transform: translateY(2px);
    box-shadow: 0 2px 0 var(--purple-dark);
  }

  .btn-submit:disabled {
    opacity: 0.4;
    cursor: not-allowed;
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
