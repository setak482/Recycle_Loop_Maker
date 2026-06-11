export function setupFloatingPanels() {
  document.querySelectorAll('.floating-panel').forEach(panel => {
    panel.querySelector('.panel-toggle')?.addEventListener('click', (e) => {
      e.stopPropagation();
      panel.classList.toggle('open');
    });
  });
}

export function setupGridToggle(grid) {
  const btn = document.getElementById('btn-grid');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const visible = grid.toggleGridLines();
    btn.textContent = visible ? '그리드 끄기' : '그리드 켜기';
  });
}

export function setupSubdivisionControls(playback, grid, objects) {
  document.querySelectorAll('input[name="sub"]').forEach(radio => {
    radio.addEventListener('change', e => {
      const value = e.target.value;
      playback.setSubdivision(value);
      grid.setSubdivision(value);
      objects.refreshDurationLines?.();
    });
  });
}
