export type Difficulty = 'easy' | 'moderate' | 'difficult';
export type QuestionType = 'mc' | 'tf';
export type AnswerState = 'default' | 'selected' | 'correct' | 'wrong' | 'disabled';
export type CheckpointState = 'locked' | 'active' | 'completed';
export type Screen = 'start' | 'board' | 'question' | 'results';
export type NucleonExpression = 'happy' | 'thinking' | 'concerned' | 'celebrating' | 'idle';

export interface Question {
  id: string;
  difficulty: Difficulty;
  type: QuestionType;
  passage: string;
  question: string;
  options: string[];
  correctIndex: number;
  justification: string;
  hint: string;
  organelle: string;
}

export interface Player {
  name: string;
  score: number;
  currentCheckpoint: number;
  completedCheckpoints: number[];
  currentDifficulty: Difficulty;
}

export interface CheckpointData {
  id: number;
  questionId: string;
  organelle: string;
  state: CheckpointState;
  x: number;
  y: number;
}

export interface LevelLayout {
  difficulty: Difficulty;
  pathD: string;
  checkpoints: { x: number; y: number }[];
}

export interface QuestionResult {
  questionId: string;
  correct: boolean;
  attempts: number;
  timeSeconds: number;
  pointsEarned: number;
  hintUsed: boolean;
}

export interface ScoreHistoryEntry {
  name: string;
  difficulty: Difficulty;
  score: number;
  totalPossible: number;
  date: string;
  stars: number;
  questionsCorrect: number;
  questionsTotal: number;
}

export interface GameState {
  screen: Screen;
  difficulty: Difficulty;
  player: Player;
  checkpoints: CheckpointData[];
  currentQuestionIndex: number;
  attemptCount: number;
  questionStartTime: number;
  hintsUnlocked: Record<string, boolean>;
  showingFeedback: boolean;
  feedbackType: 'correct' | 'wrong' | 'hint' | null;
  selectedAnswer: number | null;
  nucleonExpression: NucleonExpression;
  nucleonMessage: string;
  questionsAnswered: number;
  questionsCorrect: number;
  hintsUsedTotal: number;
  history: QuestionResult[];
  completedLevels: string[];
  lastEarnedPoints: number;
  lastSpeedBonus: number;
  currentStreak: number;
}
