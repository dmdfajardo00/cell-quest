<script lang="ts">
  import TopBar from '../components/layout/TopBar.svelte';
  import Sidebar from '../components/layout/Sidebar.svelte';
  import GameBoard from '../components/board/GameBoard.svelte';
  import Nucleon from '../components/mascot/Nucleon.svelte';
  import QuestionModal from '../components/game/QuestionModal.svelte';
  import {
    game,
    openQuestion,
    selectAnswer,
    submitAnswer,
    useHint,
    nextCheckpoint,
    tryAgain,
    continueAfterWrong,
    getCurrentQuestion,
    getProgress,
    getTotalCheckpoints,
    getCompletedCount,
    getElapsedSeconds,
    canAffordHint,
    isHintUnlocked,
    getIncorrectCount,
    setScreen,
  } from '../state/gameState.svelte';

  function handleCheckpointClick(id: number) {
    openQuestion(id);
  }

  // Timer: update elapsed seconds every second while question is open
  let timerElapsed = $state(0);
  let timerInterval: ReturnType<typeof setInterval> | null = null;

  $effect(() => {
    if (game.screen === 'question' && game.questionStartTime > 0) {
      timerElapsed = getElapsedSeconds();
      timerInterval = setInterval(() => {
        timerElapsed = getElapsedSeconds();
      }, 1000);
    } else {
      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
      }
    }
    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  });

  let currentQuestion = $derived(getCurrentQuestion());
</script>

<div class="board-layout">
  <TopBar
    playerName={game.player.name}
    score={game.player.score}
    progress={getProgress()}
    difficulty={game.difficulty}
    completedCount={getCompletedCount()}
    totalCount={getTotalCheckpoints()}
  />

  <div class="board-content">
    <div class="board-main">
      <GameBoard
        checkpoints={game.checkpoints}
        difficulty={game.difficulty}
        currentCheckpoint={game.player.currentCheckpoint}
        onCheckpointClick={handleCheckpointClick}
      />
    </div>

    <Sidebar>
      <Nucleon
        expression={game.nucleonExpression}
        message={game.nucleonMessage}
        size="sm"
      />

      <div class="stats-panel">
        <h3 class="stats-title">SESSION STATS</h3>
        <div class="stat-row">
          <span class="stat-label">Points</span>
          <span class="stat-value gold">{game.player.score}</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">Correct</span>
          <span class="stat-value correct">{game.questionsCorrect}</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">Incorrect</span>
          <span class="stat-value incorrect">{getIncorrectCount()}</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">Hints Used</span>
          <span class="stat-value">{game.hintsUsedTotal}</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">Streak</span>
          <span class="stat-value streak">{game.currentStreak}</span>
        </div>
      </div>

      <div class="hint-info">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--sky)" stroke-width="2">
          <path d="M9 18c0 2 1.5 3 3 3s3-1 3-3"/>
          <path d="M12 2a7 7 0 0 0-7 7c0 2.5 1 4 2.5 5.5S10 17 10 18h4c0-1 1-2.5 2.5-3.5S19 11.5 19 9a7 7 0 0 0-7-7z"/>
        </svg>
        <span>Hints cost 3 pts ({game.player.score} available)</span>
      </div>

      <div class="progress-info">
        <span>{getCompletedCount()} of {getTotalCheckpoints()} completed</span>
        <div class="mini-progress">
          <div class="mini-progress-fill" style="width: {getProgress()}%;"></div>
        </div>
      </div>
    </Sidebar>
  </div>

  {#if game.screen === 'question' && currentQuestion}
    <QuestionModal
      question={currentQuestion}
      difficulty={game.difficulty}
      attemptCount={game.attemptCount}
      selectedAnswer={game.selectedAnswer}
      showingFeedback={game.showingFeedback}
      feedbackType={game.feedbackType}
      hintUnlocked={isHintUnlocked(currentQuestion.id)}
      canAffordHint={canAffordHint()}
      playerScore={game.player.score}
      elapsedSeconds={timerElapsed}
      lastEarnedPoints={game.lastEarnedPoints}
      lastSpeedBonus={game.lastSpeedBonus}
      onSelectAnswer={selectAnswer}
      onSubmit={submitAnswer}
      onUseHint={useHint}
      onNext={nextCheckpoint}
      onTryAgain={tryAgain}
      onContinue={continueAfterWrong}
      onClose={() => setScreen('board')}
    />
  {/if}
</div>

<style>
  .board-layout {
    height: 100%;
    display: flex;
    flex-direction: column;
    background: var(--dark-bg);
    padding-left: env(safe-area-inset-left);
    padding-right: env(safe-area-inset-right);
    padding-bottom: env(safe-area-inset-bottom);
  }

  .board-content {
    flex: 1;
    display: flex;
    flex-direction: row;
    overflow: hidden;
    position: relative;
  }

  .board-main {
    flex: 1;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px;
    overflow: hidden;
  }

  .stats-panel {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid var(--dark-border);
    border-radius: 16px;
    padding: 16px;
  }

  .stats-title {
    font-family: var(--font-body);
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--text-on-dark-secondary);
    margin-bottom: 12px;
  }

  .stat-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  }

  .stat-row:last-child {
    border-bottom: none;
  }

  .stat-label {
    font-family: var(--font-body);
    font-size: 13px;
    color: var(--text-on-dark-secondary);
  }

  .stat-value {
    font-family: var(--font-display);
    font-size: 14px;
    font-weight: 600;
    color: var(--text-on-dark);
  }

  .stat-value.gold { color: var(--gold); }
  .stat-value.correct { color: #4ADE80; }
  .stat-value.incorrect { color: var(--coral); }
  .stat-value.streak { color: var(--purple-light); }

  .hint-info {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 14px;
    background: rgba(78, 168, 222, 0.08);
    border: 1px solid rgba(78, 168, 222, 0.15);
    border-radius: 12px;
    font-family: var(--font-body);
    font-size: 12px;
    color: var(--sky);
    font-weight: 500;
  }

  .progress-info {
    text-align: center;
  }

  .progress-info span {
    font-family: var(--font-body);
    font-size: 12px;
    color: var(--text-on-dark-secondary);
    display: block;
    margin-bottom: 6px;
  }

  .mini-progress {
    height: 6px;
    background: rgba(255, 255, 255, 0.08);
    border-radius: 6px;
    overflow: hidden;
  }

  .mini-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--purple), var(--purple-light));
    border-radius: 6px;
    transition: width 0.6s ease;
  }

</style>
