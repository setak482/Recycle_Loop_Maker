export function initHelper(manager) {
  const world = manager.grid.world;

  world.addEventListener('dragover', e => {
    const cell = e.target.closest('.grid-cell');
    if (!cell) return;

    e.preventDefault();
    cell.classList.add('highlight');
  });

  world.addEventListener('dragleave', e => {
    const cell = e.target.closest('.grid-cell');
    if (!cell) return;

    if (!cell.contains(e.relatedTarget)) {
      cell.classList.remove('highlight');
    }
  });

  world.addEventListener('drop', e => {
    const cell = e.target.closest('.grid-cell');
    if (!cell) return;

    e.preventDefault();
    cell.classList.remove('highlight');

    const fromCell = e.dataTransfer.getData('fromCell');
    const instrumentId = e.dataTransfer.getData('instrumentId');
    const key = cell.dataset.key;

    if (fromCell) {
      manager.move(fromCell, key, { preview: true });
    } else {
      manager.place(instrumentId, key, { preview: true });
    }
  });

  world.addEventListener('click', e => {
    const cell = e.target.closest('.grid-cell');
    if (!cell) return;

    const key = cell.dataset.key;
    if (manager.objects.has(key)) {
      manager.remove(key);
    }
  });
}
