<script lang="ts">
  type Expression = 'happy' | 'thinking' | 'concerned' | 'celebrating' | 'idle';
  let {
    expression = 'idle'
  }: {
    expression?: Expression;
  } = $props();

  // Use a local ref to avoid TS narrowing issues in template conditionals
  let expr: Expression = $derived(expression);
</script>

<div class="face" class:thinking={expr === 'thinking'}>
  <!-- Eyes -->
  <div class="eyes">
    <div class="eye" class:squint={expr === 'thinking'}>
      <div class="eye-white">
        {#if expr === 'celebrating'}
          <div class="star-pupil">&#9733;</div>
        {:else}
          <div class="pupil" class:wide={expr === 'happy'}>
            <div class="highlight"></div>
          </div>
        {/if}
      </div>
      {#if expr === 'concerned'}
        <div class="eyebrow left"></div>
      {/if}
    </div>
    <div class="eye">
      <div class="eye-white">
        {#if expr === 'celebrating'}
          <div class="star-pupil">&#9733;</div>
        {:else}
          <div class="pupil" class:wide={expr === 'happy'}>
            <div class="highlight"></div>
          </div>
        {/if}
      </div>
      {#if expr === 'concerned'}
        <div class="eyebrow right"></div>
      {/if}
    </div>
  </div>

  <!-- Cheeks -->
  <div class="cheeks">
    <div class="cheek left"></div>
    <div class="cheek right"></div>
  </div>

  <!-- Mouth -->
  <div class="mouth-container">
    {#if expr === 'idle'}
      <div class="mouth smile-small"></div>
    {:else if expr === 'happy'}
      <div class="mouth smile-big"></div>
    {:else if expr === 'thinking'}
      <div class="mouth wavy"></div>
    {:else if expr === 'concerned'}
      <div class="mouth frown"></div>
    {:else if expr === 'celebrating'}
      <div class="mouth open-smile"></div>
    {/if}
  </div>
</div>

<style>
  .face {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition: transform 0.3s ease;
  }

  .face.thinking {
    transform: rotate(-8deg);
  }

  /* Eyes */
  .eyes {
    display: flex;
    gap: 0.7em;
    margin-bottom: 0.3em;
  }

  .eye {
    position: relative;
    transition: transform 0.3s ease;
  }

  .eye.squint {
    transform: scaleY(0.7);
  }

  .eye-white {
    width: 1.125em;
    height: 1.375em;
    background: #fff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .pupil {
    width: 0.5625em;
    height: 0.5625em;
    background: #1A1A2E;
    border-radius: 50%;
    position: relative;
    transition: transform 0.3s ease;
  }

  .pupil.wide {
    transform: scale(1.2);
  }

  .highlight {
    position: absolute;
    width: 0.25em;
    height: 0.25em;
    background: #fff;
    border-radius: 50%;
    top: 0.06em;
    right: 0.06em;
  }

  /* Star pupils for celebrating */
  .star-pupil {
    font-size: 0.7em;
    color: #FFB938;
    line-height: 1;
    text-shadow: 0 0 4px rgba(255, 185, 56, 0.5);
  }

  /* Eyebrows for concerned */
  .eyebrow {
    position: absolute;
    top: -0.25em;
    width: 1em;
    height: 0.2em;
    border-top: 2px solid #5B2BA0;
    border-radius: 0;
  }

  .eyebrow.left {
    left: -0.05em;
    transform: rotate(15deg);
  }

  .eyebrow.right {
    right: -0.05em;
    transform: rotate(-15deg);
  }

  /* Cheeks */
  .cheeks {
    display: flex;
    gap: 2em;
    margin-top: -0.1em;
  }

  .cheek {
    width: 0.6em;
    height: 0.4em;
    background: rgba(255, 154, 176, 0.45);
    border-radius: 50%;
  }

  /* Mouth */
  .mouth-container {
    margin-top: 0.15em;
    display: flex;
    justify-content: center;
  }

  .mouth {
    transition: all 0.3s ease;
  }

  .smile-small {
    width: 0.7em;
    height: 0.35em;
    border: none;
    border-bottom: 2px solid #5B2BA0;
    border-radius: 0 0 50% 50%;
  }

  .smile-big {
    width: 1em;
    height: 0.5em;
    background: #5B2BA0;
    border-radius: 0 0 50% 50%;
    position: relative;
  }

  .smile-big::after {
    content: '';
    position: absolute;
    bottom: 0.05em;
    left: 50%;
    transform: translateX(-50%);
    width: 0.4em;
    height: 0.15em;
    background: #FF6B8A;
    border-radius: 0 0 50% 50%;
  }

  .wavy {
    width: 0.9em;
    height: 0.3em;
    border-bottom: 2px solid #5B2BA0;
    border-radius: 0;
    position: relative;
    clip-path: url(#wavy-clip);
  }

  .wavy::before {
    content: '~';
    font-size: 0.9em;
    color: #5B2BA0;
    font-weight: 700;
    position: absolute;
    top: -0.35em;
    left: 0;
    width: 100%;
    text-align: center;
  }

  /* Override the border for wavy since we use the character */
  .wavy {
    border: none;
  }

  .frown {
    width: 0.7em;
    height: 0.3em;
    border: none;
    border-top: 2px solid #5B2BA0;
    border-radius: 50% 50% 0 0;
    margin-top: 0.2em;
  }

  .open-smile {
    width: 1.1em;
    height: 0.65em;
    background: #5B2BA0;
    border-radius: 0 0 50% 50%;
    position: relative;
    animation: mouth-bounce 0.6s ease infinite alternate;
  }

  .open-smile::after {
    content: '';
    position: absolute;
    bottom: 0.05em;
    left: 50%;
    transform: translateX(-50%);
    width: 0.5em;
    height: 0.2em;
    background: #FF6B8A;
    border-radius: 0 0 50% 50%;
  }

  @keyframes mouth-bounce {
    from { transform: scaleY(1); }
    to { transform: scaleY(1.15); }
  }
</style>
