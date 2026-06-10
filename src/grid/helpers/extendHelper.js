import { KEYS } from '../constants/keys.js';
import { setGridStyle } from './initGrid.js';

export function extendCols(manager, amount = 20) {
  const startCol = manager.cols;
  const newCols = manager.cols + amount;

  setGridStyle(manager.world, manager.rows, newCols);

  for (let r = 0; r < manager.rows; r++) {
    for (let c = 0; c < amount; c++) {
      const col = startCol + c;
      const cell = document.createElement('div');
      const key = `${col}-${r}`;

      cell.classList.add('grid-cell');
      if (KEYS[r].isBlack) cell.classList.add('black-key-row');
      if (KEYS[r].note.startsWith('C') && !KEYS[r].isBlack) cell.classList.add('c-row');
      cell.dataset.key = key;
      cell.dataset.note = KEYS[r].note;

      manager.cells.set(key, { el: cell, occupied: false, note: KEYS[r].note });
      manager.world.appendChild(cell);
    }
  }

  manager.cols = newCols;
}
