# Cell Quest

Interactive science game where students explore the cell through a board-game adventure. Built with Svelte 5, packaged as an Android app via Capacitor.

## Tech Stack

- **Frontend:** Svelte 5 + TypeScript + Vite 7 + Tailwind CSS 4
- **Mobile:** Capacitor 7 (Android, landscape-only)
- **Offline:** vite-plugin-pwa (service worker + asset caching)
- **Fonts:** Fredoka (display) + Quicksand (body)

## Getting Started

### Prerequisites

- Node.js 18+
- Android Studio (for Android builds)
- Java 17+ (for Android builds)

### Install Dependencies

```bash
npm install
```

### Development

```bash
npm run dev
```

Opens at http://localhost:5555

### Type Checking

```bash
npm run check
```

### Build for Web

```bash
npm run build
npm run preview
```

### Android Development

```bash
# Build web assets
npm run build

# Sync to Android project
npx cap sync android

# Open in Android Studio
npx cap open android

# Or run directly on connected device/emulator
npx cap run android

# Live reload during development
npx cap run android --livereload --external
```

### Generate App Icons

```bash
# Requires @capacitor/assets
npx capacitor-assets generate --android
```

## Project Structure

```
src/
  lib/
    state/        # gameState.svelte.ts - all game logic
    screens/      # StartScreen, BoardScreen, ResultsScreen
    components/
      board/      # GameBoard, Checkpoint, BoardPath, PlayerMarker
      game/       # QuestionModal, PassageCard, AnswerOption, FeedbackBanner
      layout/     # TopBar, Sidebar
      mascot/     # Nucleon, NucleonFace
      ui/         # BlobButton, DifficultyBadge, etc.
    data/         # questions.ts, organelles.ts, types.ts
    icons/        # SVG icon data
public/
  icons/          # PWA icons (icon.svg, icon-192.png, icon-512.png)
android/          # Capacitor Android project
```

## Design

- **Theme:** Dark purple background (#1A1A2E), purple accent (#7C3AED)
- **Orientation:** Landscape-only (enforced via Android manifest + CSS + API)
- **Offline:** Full offline support via service worker
- **Target:** Mobile phones in landscape (~640x360dp)
