<script>
  /** @type {{ type: 'correct'|'wrong'|'hint', message: string, points?: number, showTryAgain?: boolean, showContinue?: boolean, showNext?: boolean, onTryAgain?: () => void, onContinue?: () => void, onNext?: () => void }} */
  let {
    type,
    message,
    points = 0,
    showTryAgain = false,
    showContinue = false,
    showNext = false,
    onTryAgain,
    onContinue,
    onNext
  } = $props();
</script>

<div class="feedback-banner {type}">
  <div class="accent-bar"></div>
  <div class="feedback-content">
    <div class="feedback-top">
      <div class="icon-message">
        {#if type === 'correct'}
          <svg class="feedback-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        {:else if type === 'wrong'}
          <svg class="feedback-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        {:else}
          <svg class="feedback-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 18c0 2 1.5 3 3 3s3-1 3-3"/>
            <path d="M12 2a7 7 0 0 0-7 7c0 2.5 1 4 2.5 5.5S10 17 10 18h4c0-1 1-2.5 2.5-3.5S19 11.5 19 9a7 7 0 0 0-7-7z"/>
          </svg>
        {/if}
        <span class="message-text">{message}</span>
      </div>
      {#if type === 'correct' && points}
        <span class="points-badge">+{points} pts</span>
      {/if}
    </div>
    {#if showTryAgain || showContinue || showNext}
      <div class="feedback-actions">
        {#if showTryAgain && onTryAgain}
          <button class="btn btn-try-again" onclick={onTryAgain}>Try Again</button>
        {/if}
        {#if showContinue && onContinue}
          <button class="btn btn-continue" onclick={onContinue}>Continue</button>
        {/if}
        {#if showNext && onNext}
          <button class="btn btn-next" onclick={onNext}>Next</button>
        {/if}
      </div>
    {/if}
  </div>
</div>

<style>
  .feedback-banner {
    display: flex;
    border-radius: 16px;
    overflow: hidden;
    animation: slideInRight 0.3s ease-out;
  }

  .feedback-banner.correct {
    background: #F3EEFF;
    border: 1.5px solid rgba(124, 58, 237, 0.25);
    color: #6D28D9;
  }

  .feedback-banner.wrong {
    background: #FFF0F0;
    border: 1.5px solid rgba(255, 107, 107, 0.25);
    color: #D04040;
  }

  .feedback-banner.hint {
    background: #EBF5FC;
    border: 1.5px solid rgba(78, 168, 222, 0.25);
    color: #2980B9;
  }

  .accent-bar {
    width: 4px;
    min-height: 100%;
    flex-shrink: 0;
    border-radius: 16px 0 0 16px;
  }

  .correct .accent-bar {
    background: var(--purple);
  }

  .wrong .accent-bar {
    background: var(--coral);
  }

  .hint .accent-bar {
    background: var(--sky);
  }

  .feedback-content {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 10px 14px;
    flex: 1;
  }

  .feedback-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }

  .icon-message {
    display: flex;
    align-items: center;
    gap: 10px;
    flex: 1;
  }

  .feedback-icon {
    flex-shrink: 0;
  }

  .message-text {
    font-family: var(--font-body);
    font-size: 12px;
    font-weight: 600;
    line-height: 1.35;
  }

  .points-badge {
    font-family: var(--font-display);
    font-size: 13px;
    font-weight: 600;
    background: var(--purple);
    color: #FFFFFF;
    padding: 4px 12px;
    border-radius: 50px;
    white-space: nowrap;
    animation: scorePop 0.4s ease-out;
  }

  .feedback-actions {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
  }

  .btn {
    font-family: var(--font-display);
    font-size: 14px;
    font-weight: 600;
    padding: 10px 24px;
    border-radius: 12px;
    border: none;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .btn-next {
    background: var(--purple);
    color: #FFFFFF;
    box-shadow: 0 4px 0 var(--purple-dark);
  }

  .btn-next:hover {
    transform: translateY(-1px);
    box-shadow: 0 5px 0 var(--purple-dark);
  }

  .btn-next:active {
    transform: translateY(2px);
    box-shadow: 0 2px 0 var(--purple-dark);
  }

  .btn-try-again {
    background: #FFFFFF;
    color: #D04040;
    border: 2px solid rgba(255, 107, 107, 0.4);
  }

  .btn-try-again:hover {
    background: #FFF0F0;
  }

  .btn-continue {
    background: #FFFFFF;
    color: var(--text-mid);
    border: 2px solid var(--light-border);
  }

  .btn-continue:hover {
    background: var(--light-bg);
  }

  @keyframes slideInRight {
    from { opacity: 0; transform: translateX(30px); }
    to { opacity: 1; transform: translateX(0); }
  }

  @keyframes scorePop {
    0% { transform: scale(1); }
    50% { transform: scale(1.3); }
    100% { transform: scale(1); }
  }
</style>
