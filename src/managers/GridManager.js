import { KEYS } from '../constants/keys.js';
import { CELL_W, CELL_H, COLS } from '../constants/config.js';

export class GridManager {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.world  = document.getElementById('grid-world');
    this.rows   = KEYS.length; // 88
    this.cols   = COLS;
    this.cells  = new Map();   // "col-row" → { el, occupied, note }
  }

  init() {
    this.world.style.gridTemplateColumns = `repeat(${this.cols}, ${CELL_W}px)`;
    this.world.style.gridTemplateRows    = `repeat(${this.rows}, ${CELL_H}px)`;

    KEYS.forEach((key, rowIndex) => {
      for (let c = 0; c < this.cols; c++) {
        const cell = document.createElement('div');
        const cellKey = `${c}-${rowIndex}`;

        cell.classList.add('grid-cell');
        if (key.isBlack) cell.classList.add('black-key-row');
        if (key.note.startsWith('C') && !key.isBlack) cell.classList.add('c-row'); // C 강조
        cell.dataset.key  = cellKey;
        cell.dataset.note = key.note;

        this.cells.set(cellKey, { el: cell, occupied: false, note: key.note });
        this.world.appendChild(cell);
      }
    });

    this._initPan();
    this._centerGrid();
  }

  _centerGrid() {
    // 가로 중앙, 세로는 C4 행이 화면 중간에 오도록
    const c4RowIndex = KEYS.findIndex(k => k.note === 'C4');
    const x = (this.canvas.clientWidth  - this.cols * CELL_W) / 2;
    const y = (this.canvas.clientHeight / 2) - (c4RowIndex * CELL_H);
    this._setOffset(x, y);
  }

  _initPan() {
    let dragging = false;
    let startX, startY, startOffsetX, startOffsetY;

    this.canvas.addEventListener('mousedown', e => {
      if (e.target.closest('.placed-object')) return;
      if (e.target.closest('.instrument-item')) return;
      dragging = true;
      startX = e.clientX;
      startY = e.clientY;
      startOffsetX = this._offset.x;
      startOffsetY = this._offset.y;
      this.canvas.classList.add('panning');
    });

    window.addEventListener('mousemove', e => {
      if (!dragging) return;
      this._setOffset(
        startOffsetX + (e.clientX - startX),
        startOffsetY + (e.clientY - startY)
      );
    });

    window.addEventListener('mouseup', () => {
      dragging = false;
      this.canvas.classList.remove('panning');
    });
  }

  _offset = { x: 0, y: 0 };

  _setOffset(x, y) {
    this._offset = { x, y };
    this.world.style.transform = `translate(${x}px, ${y}px)`;
  }

  getCell(key)           { return this.cells.get(key); }
  isOccupied(key)        { return this.cells.get(key)?.occupied ?? false; }
  setOccupied(key, bool) {
    const cell = this.cells.get(key);
    if (!cell) return;
    cell.occupied = bool;
    cell.el.classList.toggle('occupied', bool);
  }
  highlight(key, bool)   { this.cells.get(key)?.el.classList.toggle('highlight', bool); }
}
