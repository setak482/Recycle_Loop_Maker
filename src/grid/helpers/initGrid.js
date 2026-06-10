import { KEYS } from "../../constants/keys";
import { CELL_H, CELL_W } from "../../constants/config";

export function setGridStyle(worldElement, rows, cols){
    worldElement.style.gridTemplateColumns = `repeat(${cols}, ${CELL_W}px)`;
    worldElement.style.gridTemplateRows    = `repeat(${rows}, ${CELL_H}px)`;
}

/**
 * 단일 셀 DOM을 만들어 cellMap에 등록하고 parent에 붙입니다.
 * 명시적 grid 좌표(gridColumn/gridRow)를 부여해, 이후 열을 추가해도
 * CSS auto-flow로 기존 셀이 밀리지 않게 합니다. 확장 로직에서도 재사용합니다.
 * parent로 fragment를 넘기면 일괄 삽입에도 쓸 수 있습니다.
 */
export function buildCell(parentElement, cellMap, r, c) {
  const cell = document.createElement('div');
  const key  = `${c}-${r}`;

  cell.classList.add('grid-cell');
  cell.dataset.key  = key;
  cell.dataset.note = KEYS[r].note;
  cell.style.gridColumn = c + 1;
  cell.style.gridRow    = r + 1;

  cellMap.set(key, { el: cell, occupied: false, note: KEYS[r].note });
  parentElement.appendChild(cell);
  return cell;
}

export function createCell(worldElement, cellMap, rows, cols) {
  // 셀 14,000여 개를 라이브 DOM에 하나씩 붙이면 레이아웃 무효화가
  // 반복되므로 fragment에 모아 한 번에 삽입합니다.
  const fragment = document.createDocumentFragment();
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      buildCell(fragment, cellMap, r, c);
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
