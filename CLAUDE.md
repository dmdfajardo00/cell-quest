# CELL QUEST

An interactive educational game board for **Grade 7 Science** students in the Philippines teaching cell biology through gamified reading comprehension. Aesthetic: "Duolingo meets Spore's cell stage."

## Quick Start

```bash
npm run dev      # Dev server on port 5555
npm run build    # Production build to dist/
npm run check    # TypeScript + Svelte type checking
npm run preview  # Preview production build
```

## Android / Capacitor Commands

```bash
npx cap sync android                       # Sync web assets to Android project
npx cap open android                       # Open in Android Studio
npx cap run android                        # Run on connected device/emulator
npx cap run android --livereload --external # Live reload on device
npx capacitor-assets generate --android    # Generate Android icons from source SVG
```

## Stack

- **Svelte 5** with runes (`$state`, `$derived`, `$derived.by`, `$effect`, `$props`)
- **Vite 7** (port 5555) + **Tailwind CSS 4** (`@tailwindcss/vite` plugin)
- **TypeScript** throughout
- **Capacitor** for Android APK builds
- **100% offline** - no network requests, runs in school computer labs with zero internet
- **Single-player only** - no multiplayer, no leaderboard

## Critical Constraints

- **Offline-only**: No fetch calls, no CDN dependencies at runtime. Google Fonts loaded via `<link>` in index.html (must be cached or bundled for true offline).
- **Landscape-only**: Portrait shows a "rotate device" overlay (see `app.css`).
- **localStorage** for score history persistence (teacher review feature).

## Architecture

### Screens (state-routed, no router library)
`StartScreen` -> `BoardScreen` (with `QuestionModal` overlay) -> `ResultsScreen`

Routing via `game.screen` in `gameState.svelte.ts`:
```
'start' | 'board' | 'question' | 'results'
```

### Project Structure
```
src/
  app.css                    # Design tokens, keyframes, base styles
  main.ts                    # Entry point
  App.svelte                 # Screen router
  lib/
    data/
      types.ts               # All TypeScript interfaces
      questions.ts            # 20 questions (7 easy, 7 moderate, 6 difficult)
      organelles.ts           # Organelle metadata
    state/
      gameState.svelte.ts     # Core state machine (Svelte 5 runes)
    components/
      board/                  # SVG game board (GameBoard, BoardPath, Checkpoint, PlayerMarker)
      game/                   # Quiz UI (QuestionModal, PassageCard, AnswerOption, FeedbackBanner)
      mascot/                 # Nucleon mascot (Nucleon, NucleonFace)
      layout/                 # TopBar, Sidebar
      ui/                     # Reusable: BlobButton, DifficultyBadge, PointsBadge, ProgressBar, MembraneCard, PetriDish
    screens/                  # StartScreen, BoardScreen, ResultsScreen
    icons/
      organelles.ts           # 9 SVG organelle icon functions
      ui-icons.ts             # 8 UI SVG icon functions
public/
  icons/                      # Favicon, PWA icons (icon.svg, icon-192.png, icon-512.png)
  quizzes/                    # Modularized quiz content (easy.md, moderate.md, difficult.md)
android/                      # Capacitor Android project
```

### Game State Machine (`gameState.svelte.ts`)
- **Scoring**: 5 base pts + speed bonus (10 for <5s, 5 for <25s, 0 for >25s)
- **Mistakes**: -1 per wrong attempt, max -3 per question, never below 0 total
- **Hints**: Cost 3 pts (one-time purchase per question, free to re-view after)
- **Timer**: Elapsed time shown (not countdown), used for speed bonus calc
- **Key exports**: `game` (reactive state), `startGame()`, `openQuestion()`, `selectAnswer()`, `submitAnswer()`, `useHint()`, `nextCheckpoint()`, `setScreen()`

### Content
- 20 total questions sourced from `content.md` and coded in `src/lib/data/questions.ts`
- Each question: passage, question, 4 options (or T/F), correct index, justification, hint
- 3 difficulty levels: easy (7), moderate (7), difficult (6)
- Topics: Cell basics, Nucleus, Cell Membrane, Mitochondrion, Cell Wall, Chloroplast, Vacuole

## Brand & Design

### Colors (CSS custom properties in `app.css`)
- **Primary**: `--purple: #7C3AED`, `--purple-dark: #6D28D9`, `--purple-light: #A78BFA`
- **Accents**: `--coral: #FF6B6B`, `--gold: #FFB938`, `--sky: #4EA8DE`
- **Dark theme** (game board): `--dark-bg: #1A1A2E`, `--dark-surface: #22223A`
- **Light theme** (quiz modals): `--light-bg: #FAFBF6`, `--light-surface: #FFFFFF`

### Typography
- **Display**: `Fredoka` (headings, buttons, game UI)
- **Body**: `Quicksand` (passages, descriptions)

### Visual Style
- Blobby organic shapes (wiggle animation on border-radius)
- Duolingo-style depth-shadow buttons (`box-shadow: 0 5px 0`)
- SVG game board with cubic bezier paths connecting checkpoints
- Nucleon mascot with expression system (idle, happy, thinking, concerned, celebrating)

## Svelte 5 Patterns (IMPORTANT)

- Use `$state()` for reactive state, `$derived()` for simple expressions, `$derived.by(() => { ... })` for function bodies
- `$derived.by()` returns a VALUE, not a function - access as `myVar.x`, NOT `myVar().x`
- Props use `$props()` destructuring pattern
- Components with type annotations in destructuring MUST use `<script lang="ts">`
- Use `import { type Snippet } from 'svelte'` when accepting children/slots

## Testing

Run dev server and test manually at `http://localhost:5555`. The game flow:
1. Enter name, select difficulty, click "Start Cell Quest"
2. Click glowing (active) checkpoint on board
3. Read passage, select answer, submit
4. Correct -> next checkpoint; Wrong -> try again (max 2 attempts)
5. Complete all checkpoints -> Results screen with star rating

For automated testing, use Playwright MCP browser tools against `localhost:5555`.
