<script>
  /** @type {{ text: string }} */
  let { text } = $props();
</script>

<div class="passage-card">
  <div class="passage-label">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    </svg>
    <span>READING PASSAGE</span>
  </div>
  <p class="passage-text">{text}</p>
</div>

<style>
  .passage-card {
    background: #FFFFFF;
    border: 1.5px solid rgba(0, 0, 0, 0.08);
    border-radius: 14px;
    padding: 14px 16px;
  }

  .passage-label {
    display: flex;
    align-items: center;
    gap: 6px;
    font-family: var(--font-body);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    color: var(--text-light);
    margin-bottom: 12px;
  }

  .passage-text {
    font-family: var(--font-body);
    font-size: 13px;
    color: var(--text-mid);
    line-height: 1.55;
  }
</style>
