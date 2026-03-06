# Cell Quest - Mobile Android Landscape Implementation Plan

## Goal
Transform Cell Quest into a landscape-only Android app using Capacitor, with offline support and mobile-optimized UI.

## Architecture
- **Framework:** Svelte 5 + Vite 7 + Tailwind 4
- **Native:** Capacitor 7 (Android)
- **Offline:** vite-plugin-pwa (service worker + cache)
- **Orientation:** @capacitor/screen-orientation (landscape lock) + AndroidManifest
- **Safe Areas:** CSS env(safe-area-inset-*) for notches

## Execution Waves

### Wave 1: Foundation (Sequential)
| Task | Description |
|-|-|
| 1.1 | Install Capacitor core, CLI, Android, screen-orientation, vite-plugin-pwa |
| 1.2 | Create capacitor.config.ts |
| 1.3 | Update vite.config.ts (PWA plugin, build output) |
| 1.4 | Update index.html (viewport, safe areas, offline meta) |
| 1.5 | Update main.ts (screen orientation lock on startup) |

### Wave 2: UI Landscape Redesign (Parallel Agents)
| Task | Files | Agent |
|-|-|-|
| 2.1 | StartScreen.svelte | Agent 1 - Landscape start screen layout |
| 2.2 | BoardScreen.svelte, TopBar.svelte, Sidebar.svelte | Agent 2 - Landscape board layout |
| 2.3 | QuestionModal.svelte | Agent 3 - Landscape question modal |
| 2.4 | ResultsScreen.svelte | Agent 4 - Landscape results screen |
| 2.5 | app.css | Agent 5 - Global CSS safe areas + landscape utilities |

### Wave 3: Android Platform (Sequential)
| Task | Description |
|-|-|
| 3.1 | npx cap add android |
| 3.2 | Configure AndroidManifest.xml (landscape, fullscreen) |
| 3.3 | Build and sync |

## Key Design Decisions
- **Landscape phone viewport:** ~640x360 dp (typical). All layouts must work in this ratio.
- **Sidebar becomes bottom drawer or hidden panel on mobile** to maximize board space
- **TopBar becomes compact horizontal bar** with inline stats
- **QuestionModal uses side-by-side layout** (passage left, answers right) in landscape
- **StartScreen uses horizontal layout** (mascot left, form right)
- **ResultsScreen uses two-column layout** in landscape
- **Touch targets minimum 44x44px** per mobile-first-design skill
- **Font sizes minimum 14px** for readability on small screens
