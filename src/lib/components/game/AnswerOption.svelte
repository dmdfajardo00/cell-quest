<script>
  /** @type {{ text: string, letter: string, index: number, state: 'default'|'selected'|'correct'|'wrong'|'disabled', onclick: (index: number) => void }} */
  let { text, letter, index, state = 'default', onclick } = $props();

  function handleClick() {
    if (state === 'disabled' || state === 'correct' || state === 'wrong') return;
    onclick(index);
  }
</script>

<button
  class="answer-option {state}"
  onclick={handleClick}
  disabled={state === 'disabled'}
>
  <span class="letter-badge">{letter}</span>
  <span class="option-text">{text}</span>
</button>

<style>
  .answer-option {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    padding: 10px 14px;
    border: 2px solid var(--light-border);
    border-radius: 16px;
    background: #FFFFFF;
    cursor: pointer;
    transition: all 0.2s ease;
    width: 100%;
    text-align: left;
  }

  .answer-option:hover:not(.disabled):not(.correct):not(.wrong):not(.selected) {
    border-color: var(--purple);
    background: var(--purple-bg);
  }

  .answer-option.selected {
    border-color: var(--purple);
    background: var(--purple-bg);
    color: var(--purple-dark);
    box-shadow: 0 3px 0 var(--purple-dark);
  }

  .answer-option.correct {
    border-color: #28A745;
    background: #E8FAEB;
    color: #28A745;
    cursor: default;
  }

  .answer-option.wrong {
    border-color: var(--coral);
    background: var(--coral-bg);
    color: #D04040;
    cursor: default;
  }

  .answer-option.disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  .letter-badge {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    min-width: 32px;
    border-radius: 10px;
    font-family: var(--font-display);
    font-size: 14px;
    font-weight: 600;
    transition: all 0.2s ease;
  }

  .answer-option:not(.selected):not(.correct):not(.wrong) .letter-badge {
    background: var(--light-bg);
    color: var(--text-mid);
    border: 1.5px solid var(--light-border);
  }

  .answer-option.selected .letter-badge {
    background: var(--purple);
    color: #FFFFFF;
    border: none;
  }

  .answer-option.correct .letter-badge {
    background: #28A745;
    color: #FFFFFF;
    border: none;
  }

  .answer-option.wrong .letter-badge {
    background: var(--coral);
    color: #FFFFFF;
    border: none;
  }

  .option-text {
    font-family: var(--font-body);
    font-size: 13px;
    font-weight: 500;
    line-height: 1.35;
  }
</style>
