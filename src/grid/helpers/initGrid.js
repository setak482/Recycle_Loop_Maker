import { KEYS } from "../../constants/keys";
import { CELL_H, CELL_W } from "../../constants/config";

export function setGridStyle(worldElement, rows, cols){
    worldElement.style.gridTemplateColumns = `repeat(${cols}, ${CELL_W}px)`;
    worldElement.style.gridTemplateRows    = `repeat(${rows}, ${CELL_H}px)`;
}

export function createCell(worldElement, cellElement, rows, cols) {
  // 셀 14,000여 개를 라이브 DOM에 하나씩 붙이면 레이아웃 무효화가
  // 반복되므로 fragment에 모아 한 번에 삽입합니다.
  const fragment = document.createDocumentFragment();
  for (let r = 0; r < rows; r++) {
    const note = KEYS[r].note;
    for (let c = 0; c < cols; c++) {
      const cell = document.createElement('div');
      const key  = `${c}-${r}`;

      cell.className    = 'grid-cell';
      cell.dataset.key  = key;
      cell.dataset.note = note;

      cellElement.set(key, { el: cell, occupied: false, note });
      fragment.appendChild(cell);
    }
  }
  worldElement.appendChild(fragment);
}

export function centerGrid(manager) {
  // 가로 중앙, 세로는 C4 행이 화면 중간에 오도록
  const c4RowIndex = KEYS.findIndex(k => k.note === 'C4');
  const x = ((manager.canvas.clientWidth - manager.labelWidth) - manager.cols * CELL_W) / 2 + manager.labelWidth;
  const y = (manager.canvas.clientHeight / 2) - (c4RowIndex * CELL_H);

  manager.world.style.left = `${manager.labelWidth}px`;
  manager._offset.x = x;
  manager._offset.y = y;
  manager._applyTransform();
}
