import type {
  GameState,
  Screen,
  Difficulty,
  CheckpointData,
  QuestionResult,
  ScoreHistoryEntry,
} from '../data/types';
import { questions, getQuestionsByDifficulty } from '../data/questions';
import { play } from '../audio/soundManager';
import {
  savePrefs,
  loadPrefs,
  saveHistory,
  loadHistory,
  saveGameSnapshot,
  loadGameSnapshot,
  clearGameSnapshot,
  clearAllData as clearStorage,
  type PlayerPrefs,
} from './storage';

// Scoring constants
const BASE_POINTS = 5;
const SPEED_BONUS_FAST = 10;   // within 5 seconds
const SPEED_BONUS_MED = 5;    // within 25 seconds
const SPEED_BONUS_SLOW = 0;   // after 25 seconds
const HINT_COST = 3;
const MAX_MISTAKE_PENALTY = 3;

// Board layouts: checkpoint positions for each difficulty
const BOARD_LAYOUTS: Record<Difficulty, { x: number; y: number }[]> = {
  easy: [
    { x: 80, y: 340 },
    { x: 220, y: 260 },
    { x: 380, y: 300 },
    { x: 500, y: 200 },
    { x: 620, y: 270 },
    { x: 740, y: 180 },
    { x: 860, y: 240 },
  ],
  moderate: [
    { x: 100, y: 320 },
    { x: 240, y: 220 },
    { x: 340, y: 340 },
    { x: 480, y: 240 },
    { x: 600, y: 320 },
    { x: 720, y: 200 },
    { x: 850, y: 280 },
  ],
  difficult: [
    { x: 120, y: 300 },
    { x: 280, y: 200 },
    { x: 440, y: 300 },
    { x: 580, y: 180 },
    { x: 720, y: 280 },
    { x: 860, y: 200 },
  ],
};

const encouragingMessages = [
  "Amazing! You're a cell expert!",
  'Brilliant work!',
  "That's correct! You really understood the passage!",
  'Fantastic! Keep it up!',
  "You're on fire! Great reading!",
  'Perfect! Your cell knowledge is growing!',
];

const wrongMessages1 = [
  'Not quite! Read the passage again carefully.',
  'Almost! Think about what the passage says.',
  "Close! Let's try that one more time.",
  'Good try! Look at the passage for clues.',
];

const wrongMessages2 = [
  "No worries! Let's learn this together.",
  "That's okay! Here's what the answer is:",
  "Learning is a journey! Here's the explanation:",
];

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getSpeedBonus(timeSeconds: number): number {
  if (timeSeconds <= 5) return SPEED_BONUS_FAST;
  if (timeSeconds <= 25) return SPEED_BONUS_MED;
  return SPEED_BONUS_SLOW;
}

function buildCheckpoints(difficulty: Difficulty): CheckpointData[] {
  const qs = getQuestionsByDifficulty(difficulty);
  const positions = BOARD_LAYOUTS[difficulty];
  return qs.map((q, i) => ({
    id: i,
    questionId: q.id,
    organelle: q.organelle,
    state: i === 0 ? 'active' : 'locked',
    x: positions[i].x,
    y: positions[i].y,
  }));
}

function createInitialState(): GameState {
  return {
    screen: 'start',
    difficulty: 'easy',
    player: {
      name: '',
      score: 0,
      currentCheckpoint: 0,
      completedCheckpoints: [],
      currentDifficulty: 'easy',
    },
    checkpoints: buildCheckpoints('easy'),
    currentQuestionIndex: 0,
    attemptCount: 0,
    questionStartTime: 0,
    hintsUnlocked: {},
    showingFeedback: false,
    feedbackType: null,
    selectedAnswer: null,
    nucleonExpression: 'idle',
    nucleonMessage: "Welcome to CELL QUEST! I'm Nucleon, your guide through the cell! Tap the glowing checkpoint to begin.",
    questionsAnswered: 0,
    questionsCorrect: 0,
    hintsUsedTotal: 0,
    history: [],
    completedLevels: [],
    lastEarnedPoints: 0,
    lastSpeedBonus: 0,
    currentStreak: 0,
  };
}

// Reactive game state
export const game = $state<GameState>(createInitialState());

// Derived values
export function getCurrentQuestion() {
  const checkpoint = game.checkpoints[game.player.currentCheckpoint];
  if (!checkpoint) return null;
  return questions.find(q => q.id === checkpoint.questionId) ?? null;
}

export function getProgress(): number {
  const total = game.checkpoints.length;
  if (total === 0) return 0;
  return (game.player.completedCheckpoints.length / total) * 100;
}

export function getTotalCheckpoints(): number {
  return game.checkpoints.length;
}

export function getCompletedCount(): number {
  return game.player.completedCheckpoints.length;
}

export function getStarRating(): number {
  const total = game.checkpoints.length;
  if (total === 0) return 0;
  const ratio = game.questionsCorrect / total;
  if (ratio >= 0.85) return 3;
  if (ratio >= 0.6) return 2;
  return 1;
}

export function getElapsedSeconds(): number {
  if (game.questionStartTime === 0) return 0;
  return Math.floor((Date.now() - game.questionStartTime) / 1000);
}

export function canAffordHint(): boolean {
  return game.player.score >= HINT_COST;
}

export function isHintUnlocked(questionId: string): boolean {
  return game.hintsUnlocked[questionId] === true;
}

export function getMaxPossibleScore(): number {
  const total = game.checkpoints.length;
  return total * (BASE_POINTS + SPEED_BONUS_FAST); // Best case: all correct, all fast
}

// --- Persistence ---

let cachedHistory: ScoreHistoryEntry[] = [];

function persistPrefs() {
  savePrefs({
    name: game.player.name,
    lastDifficulty: game.difficulty,
    completedLevels: game.completedLevels,
  });
}

function persistSnapshot() {
  saveGameSnapshot(JSON.parse(JSON.stringify(game)));
}

export function saveScoreToHistory() {
  const entry: ScoreHistoryEntry = {
    name: game.player.name,
    difficulty: game.difficulty,
    score: game.player.score,
    totalPossible: getMaxPossibleScore(),
    date: new Date().toISOString().split('T')[0],
    stars: getStarRating(),
    questionsCorrect: game.questionsCorrect,
    questionsTotal: game.checkpoints.length,
  };
  cachedHistory = [...cachedHistory, entry];
  saveHistory(cachedHistory);
}

export function getScoreHistory(): ScoreHistoryEntry[] {
  return cachedHistory;
}

// Init: restore prefs and history from storage
export async function initFromStorage(): Promise<{ hasSave: boolean }> {
  const [prefs, history, snapshot] = await Promise.all([
    loadPrefs(),
    loadHistory(),
    loadGameSnapshot(),
  ]);

  cachedHistory = history;

  if (prefs) {
    game.player.name = prefs.name;
    game.difficulty = prefs.lastDifficulty;
    game.completedLevels = prefs.completedLevels ?? [];
  }

  return { hasSave: snapshot !== null };
}

export async function resumeGame(): Promise<boolean> {
  const snapshot = await loadGameSnapshot();
  if (!snapshot) return false;
  Object.assign(game, snapshot);
  // Ensure we're on the board, not stuck in question
  if (game.screen === 'question') {
    game.screen = 'board';
    game.showingFeedback = false;
    game.feedbackType = null;
    game.selectedAnswer = null;
  }
  return true;
}

export async function clearAllGameData() {
  await clearStorage();
  cachedHistory = [];
  const initial = createInitialState();
  Object.assign(game, initial);
}

export function updatePlayerName(name: string) {
  game.player.name = name;
  persistPrefs();
}

// Actions
export function setScreen(screen: Screen) {
  game.screen = screen;
}

export function setDifficulty(difficulty: Difficulty) {
  game.difficulty = difficulty;
}

export function setPlayerName(name: string) {
  game.player.name = name;
}

export function startGame() {
  game.player.score = 0;
  game.player.currentCheckpoint = 0;
  game.player.completedCheckpoints = [];
  game.player.currentDifficulty = game.difficulty;
  game.checkpoints = buildCheckpoints(game.difficulty);
  game.questionsAnswered = 0;
  game.questionsCorrect = 0;
  game.hintsUsedTotal = 0;
  game.hintsUnlocked = {};
  game.history = [];
  game.currentStreak = 0;
  game.nucleonExpression = 'idle';
  game.nucleonMessage = "Let's explore the cell! Tap the glowing checkpoint to start your first challenge.";
  game.screen = 'board';
  play('gameStart');
  persistPrefs();
  clearGameSnapshot();
}

export function openQuestion(checkpointId: number) {
  const cp = game.checkpoints[checkpointId];
  if (!cp || cp.state !== 'active') return;
  play('pop');

  game.player.currentCheckpoint = checkpointId;
  game.currentQuestionIndex = checkpointId;
  game.attemptCount = 0;
  game.questionStartTime = Date.now();
  game.showingFeedback = false;
  game.feedbackType = null;
  game.selectedAnswer = null;
  game.lastEarnedPoints = 0;
  game.lastSpeedBonus = 0;

  const q = getCurrentQuestion();
  game.nucleonExpression = 'thinking';
  game.nucleonMessage = `Let's learn about the ${q?.organelle ?? 'cell'}! Read the passage carefully.`;
  game.screen = 'question';
  persistSnapshot();
}

export function selectAnswer(index: number) {
  if (game.showingFeedback) return;
  game.selectedAnswer = index;
  play('select');
}

export function useHint() {
  const q = getCurrentQuestion();
  if (!q) return;

  // If already unlocked for this question, just show it
  if (game.hintsUnlocked[q.id]) {
    game.nucleonExpression = 'thinking';
    game.nucleonMessage = q.hint;
    play('hint');
    game.feedbackType = 'hint';
    game.showingFeedback = true;
    setTimeout(() => {
      if (game.feedbackType === 'hint') {
        game.showingFeedback = false;
        game.feedbackType = null;
      }
    }, 5000);
    return;
  }

  // First time: charge 3 points
  if (game.player.score < HINT_COST) return;

  game.player.score -= HINT_COST;
  game.hintsUnlocked[q.id] = true;
  game.hintsUsedTotal++;

  game.nucleonExpression = 'thinking';
  game.nucleonMessage = q.hint;
  play('hint');
  game.feedbackType = 'hint';
  game.showingFeedback = true;

  setTimeout(() => {
    if (game.feedbackType === 'hint') {
      game.showingFeedback = false;
      game.feedbackType = null;
    }
  }, 5000);
}

export function submitAnswer() {
  if (game.selectedAnswer === null) return;

  const q = getCurrentQuestion();
  if (!q) return;

  game.attemptCount++;
  const isCorrect = game.selectedAnswer === q.correctIndex;
  const timeSeconds = getElapsedSeconds();

  if (isCorrect) {
    const speedBonus = getSpeedBonus(timeSeconds);
    const earned = BASE_POINTS + speedBonus;
    game.player.score += earned;
    game.questionsCorrect++;
    game.questionsAnswered++;
    game.lastEarnedPoints = earned;
    game.lastSpeedBonus = speedBonus;
    game.currentStreak++;
    game.feedbackType = 'correct';
    game.showingFeedback = true;
    play('correct');
    if (speedBonus > 0) play('speedBonus');
    if (game.currentStreak >= 3) play('streak');
    game.nucleonExpression = 'happy';

    let bonusText = '';
    if (speedBonus > 0) {
      bonusText = ` (+${BASE_POINTS} base +${speedBonus} speed bonus = ${earned} pts!)`;
    } else {
      bonusText = ` (+${earned} points!)`;
    }
    game.nucleonMessage = `${randomFrom(encouragingMessages)}${bonusText}`;

    // Record in history
    game.history.push({
      questionId: q.id,
      correct: true,
      attempts: game.attemptCount,
      timeSeconds,
      pointsEarned: earned,
      hintUsed: game.hintsUnlocked[q.id] ?? false,
    });
  } else {
    // Apply mistake penalty: -1 per wrong attempt, max -3 total per question
    const penaltySoFar = Math.min(game.attemptCount - 1, MAX_MISTAKE_PENALTY - 1);
    if (penaltySoFar < MAX_MISTAKE_PENALTY) {
      game.player.score = Math.max(0, game.player.score - 1);
    }

    game.feedbackType = 'wrong';
    game.showingFeedback = true;
    game.currentStreak = 0;
    if (game.attemptCount >= 2) {
      play('wrongFinal');
    } else {
      play('wrong');
    }

    if (game.attemptCount >= 2) {
      game.questionsAnswered++;
      game.nucleonExpression = 'concerned';
      game.nucleonMessage = `${randomFrom(wrongMessages2)} ${q.justification}`;

      // Record in history as incorrect
      game.history.push({
        questionId: q.id,
        correct: false,
        attempts: game.attemptCount,
        timeSeconds,
        pointsEarned: 0,
        hintUsed: game.hintsUnlocked[q.id] ?? false,
      });
    } else {
      game.nucleonExpression = 'concerned';
      game.nucleonMessage = randomFrom(wrongMessages1);
    }
  }
}

export function tryAgain() {
  game.selectedAnswer = null;
  game.showingFeedback = false;
  game.feedbackType = null;
  game.nucleonExpression = 'thinking';
  game.nucleonMessage = "Give it another shot! Read the passage one more time.";
}

export function nextCheckpoint() {
  const cpId = game.player.currentCheckpoint;
  game.checkpoints[cpId].state = 'completed';
  game.player.completedCheckpoints = [...game.player.completedCheckpoints, cpId];

  const nextId = cpId + 1;
  if (nextId < game.checkpoints.length) {
    game.checkpoints[nextId].state = 'active';
    game.player.currentCheckpoint = nextId;
    game.nucleonExpression = 'idle';
    game.nucleonMessage = "Great progress! Tap the next glowing checkpoint when you're ready.";
    game.screen = 'board';
    play('advance');
    persistSnapshot();
  } else {
    // Level complete
    if (!game.completedLevels.includes(game.difficulty)) {
      game.completedLevels = [...game.completedLevels, game.difficulty];
    }
    saveScoreToHistory();
    persistPrefs();
    clearGameSnapshot();
    game.nucleonExpression = 'celebrating';
    game.nucleonMessage = `You completed the ${game.difficulty} level! Show your score to your teacher!`;
    game.screen = 'results';
    play('levelComplete');
  }

  // Reset question state
  game.selectedAnswer = null;
  game.showingFeedback = false;
  game.feedbackType = null;
  game.attemptCount = 0;
  game.questionStartTime = 0;
}

export function continueAfterWrong() {
  nextCheckpoint();
}

export function nextLevel() {
  const levels: Difficulty[] = ['easy', 'moderate', 'difficult'];
  const currentIdx = levels.indexOf(game.difficulty);
  if (currentIdx < levels.length - 1) {
    game.difficulty = levels[currentIdx + 1];
    startGame();
  }
}

export function replay() {
  startGame();
}

export function backToStart() {
  clearGameSnapshot();
  const initial = createInitialState();
  // Preserve name and completedLevels across sessions
  const name = game.player.name;
  const completed = game.completedLevels;
  Object.assign(game, initial);
  game.player.name = name;
  game.completedLevels = completed;
}

export function hasNextLevel(): boolean {
  const levels: Difficulty[] = ['easy', 'moderate', 'difficult'];
  return levels.indexOf(game.difficulty) < levels.length - 1;
}

export function getIncorrectCount(): number {
  return game.history.filter(h => !h.correct).length;
}
