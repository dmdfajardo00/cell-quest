# CELL QUEST - Implementation Plan

## Project Overview

CELL QUEST is an interactive web-based educational game board for Grade 7 Science students in the Philippines. Students read passages about cell biology, answer questions, receive immediate feedback, and progress through a cell-themed game board. Think: Duolingo meets Spore's cell stage.

**100% OFFLINE** - No network requests, no APIs, no cloud. Runs entirely client-side in school computer labs with potentially zero internet. Single-player only.

## Critical Design Decisions (Updated)

- **No leaderboard** - removed (no way to aggregate scores offline)
- **No multiplayer/collaborative mode** - single-player only
- **Scoring**: Flat 5 base points + speed bonus (10/5/0 for <5s/<25s/>25s) per correct answer
- **Mistakes**: -1 point per wrong attempt, max -3 per question, never below 0 total
- **Hints**: Cost 3 points, one-time purchase per question (view unlimited after buying)
- **Timer**: Elapsed time shown subtly (not countdown), used for speed bonus calculation
- **Score history**: Stored in localStorage for teacher review
- **Sidebar**: Session stats + Nucleon mascot (replaces leaderboard)

## Technical Decisions

### Framework & Build
- **Svelte 5** with runes (`$state`, `$derived`, `$effect`, `$props`)
- **Vite** for build tooling
- **TypeScript** throughout
- **Tailwind CSS 4** + custom CSS for brand effects (glows, blob animations, membrane borders)
- No router library - simple state-based view switching via a `currentScreen` state variable
- Static site deployment (no SSR)

### State Management
- Single global game state object using Svelte 5 `$state` rune
- Reactive derivations via `$derived` for computed values (progress %, current question, etc.)
- `$effect` for side effects (localStorage persistence, animation triggers)
- No external state management libraries

### Animation Approach
- CSS animations for persistent effects (blob wiggle, orbit, pulse, glow)
- CSS transitions for state changes (answer selection, hover, button press)
- Svelte transitions (`fly`, `fade`, `scale`) for mount/unmount
- `requestAnimationFrame` for player marker path animation only

### Routing Strategy
- No SPA router. A single `currentScreen` enum state controls which screen renders:
  - `start` | `board` | `question` | `results`
- Screen transitions use Svelte `{#if}` blocks with transitions

## File & Folder Structure

```
cell-quest/
  docs/
    PLAN.md
  src/
    app.html
    app.css                     # Global styles, design tokens, fonts, animations
    App.svelte                  # Root component, screen router
    lib/
      data/
        questions.ts            # Parsed question bank from content.md
        types.ts                # TypeScript interfaces/types
        organelles.ts           # Organelle metadata (names, icons, colors)
      state/
        gameState.svelte.ts     # Core game state machine (Svelte 5 runes)
      components/
        ui/
          BlobButton.svelte
          DifficultyBadge.svelte
          PointsBadge.svelte
          ProgressBar.svelte
          MembraneCard.svelte
          PetriDish.svelte
        board/
          GameBoard.svelte
          Checkpoint.svelte
          PlayerMarker.svelte
          BoardPath.svelte
        game/
          QuestionModal.svelte
          PassageCard.svelte
          AnswerOption.svelte
          FeedbackBanner.svelte
        mascot/
          Nucleon.svelte
          NucleonFace.svelte
        layout/
          TopBar.svelte
          Leaderboard.svelte
          Sidebar.svelte
      screens/
        StartScreen.svelte
        BoardScreen.svelte
        ResultsScreen.svelte
      icons/
        organelles.ts           # SVG icon components for each organelle
        ui-icons.ts             # Checkmark, X, lightbulb, star, hint SVGs
  index.html
  package.json
  svelte.config.js
  vite.config.ts
  tsconfig.json
  tailwind.config.ts
```

## Component Hierarchy

```
App.svelte
  StartScreen.svelte
    Nucleon.svelte
    BlobButton.svelte
    DifficultyBadge.svelte
  BoardScreen.svelte
    TopBar.svelte
      PointsBadge.svelte
      ProgressBar.svelte
      DifficultyBadge.svelte
    GameBoard.svelte
      BoardPath.svelte
      Checkpoint.svelte (x N)
      PlayerMarker.svelte
    Sidebar.svelte
      Nucleon.svelte
      Leaderboard.svelte
    QuestionModal.svelte (overlay)
      DifficultyBadge.svelte
      PassageCard.svelte
      AnswerOption.svelte (x 4 or x 2)
      BlobButton.svelte
      FeedbackBanner.svelte
  ResultsScreen.svelte
    Nucleon.svelte
    BlobButton.svelte
    PointsBadge.svelte
```

## Data Model

```typescript
// types.ts

type Difficulty = 'easy' | 'moderate' | 'difficult';
type QuestionType = 'mc' | 'tf';
type AnswerState = 'default' | 'selected' | 'correct' | 'wrong' | 'disabled';
type CheckpointState = 'locked' | 'active' | 'completed';
type Screen = 'start' | 'board' | 'question' | 'results';
type GameMode = 'individual' | 'collaborative';
type NucleonExpression = 'happy' | 'thinking' | 'concerned' | 'celebrating' | 'idle';

interface Question {
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

interface Player {
  name: string;
  score: number;
  hintsRemaining: number;
  currentCheckpoint: number;
  completedCheckpoints: number[];
  currentDifficulty: Difficulty;
}

interface CheckpointData {
  id: number;
  questionId: string;
  organelle: string;
  state: CheckpointState;
  x: number;
  y: number;
}

interface GameState {
  screen: Screen;
  mode: GameMode;
  difficulty: Difficulty;
  player: Player;
  checkpoints: CheckpointData[];
  currentQuestionIndex: number;
  attemptCount: number;
  hintUsed: boolean;
  showingFeedback: boolean;
  feedbackType: 'correct' | 'wrong' | 'hint' | null;
  selectedAnswer: number | null;
  nucleonExpression: NucleonExpression;
  nucleonMessage: string;
}
```

## Game State Machine

```
States & Transitions:

[START]
  -> selectMode(mode) -> [START with mode selected]
  -> selectDifficulty(diff) -> [START with difficulty selected]
  -> enterName(name) -> [START with name]
  -> startGame() -> [BOARD] (requires mode + difficulty + name)

[BOARD]
  -> tapCheckpoint(id) -> [QUESTION] (only if checkpoint is active)
  -> viewResults() -> [RESULTS] (only if all checkpoints complete)

[QUESTION]
  -> selectAnswer(index) -> [QUESTION with selectedAnswer]
  -> useHint() -> [QUESTION with hint shown, -10 pts]
  -> submitAnswer() ->
    if correct && attempt 1: award full points -> [FEEDBACK_CORRECT]
    if correct && attempt 2: award half points -> [FEEDBACK_CORRECT]
    if wrong && attempt 1: -> [FEEDBACK_WRONG_1]
    if wrong && attempt 2: show justification -> [FEEDBACK_WRONG_2]

[FEEDBACK_CORRECT]
  -> nextCheckpoint() -> [BOARD] (unlock next, move marker)

[FEEDBACK_WRONG_1]
  -> tryAgain() -> [QUESTION] (reset selection, increment attempt)

[FEEDBACK_WRONG_2]
  -> continue() -> [BOARD] (unlock next anyway, 0 points)

[BOARD with all complete]
  -> completeLevel() -> [RESULTS]

[RESULTS]
  -> nextLevel() -> [BOARD] (next difficulty, reset checkpoints)
  -> replay() -> [BOARD] (same difficulty, reset)
  -> backToStart() -> [START]
```

## Scoring

| Scenario | Easy | Moderate | Difficult |
|-|-|-|-|
| 1st attempt correct | 50 | 75 | 100 |
| 2nd attempt correct | 25 | 37 | 50 |
| Hint used | -10 | -10 | -10 |
| 2nd attempt wrong | 0 | 0 | 0 |
| Minimum score | 0 | 0 | 0 |

## Board Layout

Each difficulty level has a winding SVG path through a stylized cell:
- **Easy**: 7 checkpoints, gentle curves, warm purple glow
- **Moderate**: 7 checkpoints, more complex path, deeper purple
- **Difficult**: 6 checkpoints, challenging winding path, intense purple glow

Checkpoints are positioned along cubic bezier curves. The path is defined as SVG `<path>` elements with checkpoint nodes at measured positions along the path.

## Color System (Purple Brand - adapted from brand-v2)

### Primary Purple (replaces all green)
- Primary: `#7C3AED` (Rich Violet)
- Dark: `#6D28D9`
- Light: `#A78BFA` (Soft Lavender)
- Bright: `#8B5CF6` (Bright Playful)
- Background: `#F3EEFF`

### Accents (unchanged from brand)
- Coral: `#FF6B6B` (errors/wrong)
- Gold: `#FFB938` (points/rewards)
- Sky: `#4EA8DE` (hints/info)

### Dark Theme (game board)
- Background: `#1A1A2E`
- Surface: `#22223A`
- Elevated: `#2A2A48`
- Border: `rgba(255,255,255,0.08)`

### Light Theme (reading/question panels)
- Background: `#FAFBF6`
- Surface: `#FFFFFF`
- Border: `rgba(0,0,0,0.08)`

## Task Breakdown

### Wave 1: Foundation (sequential, must complete first)

**Task 1.1: Project Setup**
- Initialize Svelte 5 + Vite project
- Install Tailwind CSS 4
- Configure TypeScript
- Set up folder structure
- Create index.html with Google Fonts (Fredoka, Quicksand)
- Files: package.json, vite.config.ts, svelte.config.js, tsconfig.json, src/app.html, index.html

**Task 1.2: Design Tokens & Global Styles**
- CSS custom properties for all colors (purple brand system)
- Typography tokens (Fredoka, Quicksand)
- Spacing, border-radius, shadow tokens
- Keyframe animations (blobFloat, wiggle, orbit-slow, pulse-soft, fade-up)
- Dark/light theme base styles
- Files: src/app.css, tailwind.config.ts

**Task 1.3: Data Layer**
- TypeScript type definitions
- Parse content.md into structured question bank
- Generate hints for each question
- Organelle metadata (name, color, description)
- Files: src/lib/data/types.ts, src/lib/data/questions.ts, src/lib/data/organelles.ts

**Task 1.4: Game State Machine**
- Core game state with Svelte 5 runes
- All state transitions
- Scoring logic
- localStorage persistence
- Files: src/lib/state/gameState.svelte.ts

### Wave 2: Components (parallel, independent)

**Task 2.1: Core UI Components**
- BlobButton (Duolingo-style depth shadow button)
- DifficultyBadge (Easy/Moderate/Difficult pill)
- PointsBadge (score display with gold accent)
- ProgressBar (animated fill with gradient)
- MembraneCard (organic border card for light theme)
- PetriDish (dark theme container with dashed inner border)
- Files: src/lib/components/ui/*.svelte

**Task 2.2: SVG Organelle Icons**
- Custom SVG icons for each organelle (cell, nucleus, membrane, mitochondrion, chloroplast, cell wall, vacuole, ribosome, cytoplasm)
- UI icons (checkmark, X, lightbulb, star, hint)
- Blobby organic style matching brand
- Files: src/lib/icons/organelles.ts, src/lib/icons/ui-icons.ts

**Task 2.3: Game Board**
- SVG winding path through cell interior
- Three difficulty layouts
- Organic curved paths (cubic beziers)
- Background decorations (floating organelles, membrane texture)
- Files: src/lib/components/board/GameBoard.svelte, src/lib/components/board/BoardPath.svelte

**Task 2.4: Checkpoint Component**
- Locked/active/completed states
- Glow/pulse animation for active state
- Organelle icon display
- Name label below
- Checkmark overlay for completed
- Files: src/lib/components/board/Checkpoint.svelte

**Task 2.5: Player Marker**
- Animated blob marker
- Path-following movement between checkpoints
- Bounce/arrive animation
- Files: src/lib/components/board/PlayerMarker.svelte

**Task 2.6: Question Modal**
- Full-screen overlay on dark bg
- Organelle name + icon header
- Difficulty badge
- Passage card section
- Answer grid (2x2 for MC, 2x1 for TF)
- Hint button
- Submit button
- Feedback area
- Attempt tracking display
- Files: src/lib/components/game/QuestionModal.svelte

**Task 2.7: Passage Card & Answer Options**
- PassageCard: light bg, reading-card styling, book icon label
- AnswerOption: letter badge + text, all states (default, selected, correct, wrong, disabled)
- Grid layout responsive
- Files: src/lib/components/game/PassageCard.svelte, src/lib/components/game/AnswerOption.svelte

**Task 2.8: Feedback Banner**
- Correct feedback: purple bg, checkmark, points earned, justification
- Wrong feedback (1st): coral accent, encouragement, try again button
- Wrong feedback (2nd): coral, explanation/justification, continue button
- Hint feedback: sky accent, hint text
- Slide-in animation
- Files: src/lib/components/game/FeedbackBanner.svelte

**Task 2.9: Nucleon Mascot**
- SVG body with blobby shape and wiggle animation
- Face with eyes (pupils that track), mouth, cheeks
- Expression system (happy, thinking, concerned, celebrating, idle)
- Orbiting organelle dots (cyan, pink, gold, green)
- Speech bubble with contextual messages
- Files: src/lib/components/mascot/Nucleon.svelte, src/lib/components/mascot/NucleonFace.svelte

**Task 2.10: TopBar & Leaderboard**
- TopBar: points badge, hints remaining, progress bar, current level, difficulty badge
- Leaderboard: dark theme sidebar, ranked rows with avatar/name/score, gold highlight for #1
- Files: src/lib/components/layout/TopBar.svelte, src/lib/components/layout/Leaderboard.svelte, src/lib/components/layout/Sidebar.svelte

### Wave 3: Screens (parallel, depends on Wave 2)

**Task 3.1: Start Screen**
- Game logo (CELL QUEST in Fredoka with purple glow)
- Nucleon mascot intro with speech
- Play mode toggle (Individual / Collaborative)
- Difficulty selection (3 badges)
- Player name input
- "Start Cell Quest" blob button
- Background: dark with floating cell blobs
- Files: src/lib/screens/StartScreen.svelte

**Task 3.2: Board Screen**
- Full layout: TopBar + GameBoard + Sidebar
- Wires up game state to board, checkpoints, player marker
- Opens QuestionModal on checkpoint tap
- Nucleon contextual messages
- Files: src/lib/screens/BoardScreen.svelte

**Task 3.3: Results Screen**
- Score breakdown panel
- Correct/incorrect/hints used stats
- Star rating (1-3 stars based on performance)
- "Next Level" / "Play Again" / "Back to Menu" buttons
- Nucleon celebration
- Files: src/lib/screens/ResultsScreen.svelte

### Wave 4: Integration (sequential, depends on all above)

**Task 4.1: App Shell & Screen Router**
- Wire up App.svelte with screen switching
- Svelte transitions between screens
- Connect all state to components
- Files: src/App.svelte

**Task 4.2: Polish & Animations**
- Page transition animations
- Micro-interactions (button hover, answer select, checkpoint glow)
- Entrance animations for components
- Smooth board transitions between levels
- Score counter animation
- Files: various component files

**Task 4.3: Responsive & Accessibility**
- 1366x768 desktop optimization (PH school monitors)
- Tablet responsive adjustments
- ARIA labels on all interactive elements
- Keyboard navigation support
- Focus management in question modal
- Color contrast verification

## Subagent Delegation Plan

### Wave 1 (sequential):
1. Setup Agent -> Task 1.1 + 1.2 (project + design tokens)
2. Data Agent -> Task 1.3 + 1.4 (data layer + game state)

### Wave 2 (parallel after Wave 1):
3. UI Components Agent -> Task 2.1 (BlobButton, badges, progress, cards)
4. Icons Agent -> Task 2.2 (SVG organelle + UI icons)
5. Board Agent -> Task 2.3 + 2.4 + 2.5 (board, checkpoints, player marker)
6. Question Agent -> Task 2.6 + 2.7 + 2.8 (modal, passage, answers, feedback)
7. Mascot Agent -> Task 2.9 (Nucleon system)
8. Layout Agent -> Task 2.10 (TopBar, leaderboard, sidebar)

### Wave 3 (parallel after Wave 2):
9. Start Screen Agent -> Task 3.1
10. Board Screen Agent -> Task 3.2
11. Results Screen Agent -> Task 3.3

### Wave 4 (sequential after Wave 3):
12. Integration Agent -> Task 4.1 + 4.2 + 4.3 (wiring, polish, responsive)
