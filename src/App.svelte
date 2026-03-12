<script lang="ts">
  import { game, initFromStorage } from './lib/state/gameState.svelte';
  import StartScreen from './lib/screens/StartScreen.svelte';
  import BoardScreen from './lib/screens/BoardScreen.svelte';
  import ResultsScreen from './lib/screens/ResultsScreen.svelte';
  import CompletionScreen from './lib/screens/CompletionScreen.svelte';

  let hasSavedGame = $state(false);
  let ready = $state(false);

  $effect(() => {
    initFromStorage().then((result) => {
      hasSavedGame = result.hasSave;
      ready = true;
    });
  });
</script>

<main class="h-full w-full">
  {#if !ready}
    <div style="display:flex;align-items:center;justify-content:center;height:100%;background:var(--dark-bg);">
      <span style="font-family:var(--font-display);color:var(--purple-light);font-size:18px;">Loading...</span>
    </div>
  {:else if game.screen === 'start'}
    <StartScreen {hasSavedGame} />
  {:else if game.screen === 'board' || game.screen === 'question'}
    <BoardScreen />
  {:else if game.screen === 'results'}
    <ResultsScreen />
  {:else if game.screen === 'completion'}
    <CompletionScreen />
  {/if}
</main>
