<script lang="ts">
  import { game } from './lib/state/gameState.svelte';
  import StartScreen from './lib/screens/StartScreen.svelte';
  import BoardScreen from './lib/screens/BoardScreen.svelte';
  import ResultsScreen from './lib/screens/ResultsScreen.svelte';
</script>

<main class="h-full w-full">
  {#if game.screen === 'start'}
    <StartScreen />
  {:else if game.screen === 'board' || game.screen === 'question'}
    <BoardScreen />
  {:else if game.screen === 'results'}
    <ResultsScreen />
  {/if}
</main>
