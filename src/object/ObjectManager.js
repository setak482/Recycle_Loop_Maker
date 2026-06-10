import { KEYS } from '../constants/keys.js';
import { initHelper } from './helpers/initHelper.js';
import { placeHelper } from './helpers/placeHelper.js';
import { removeHelper } from './helpers/removeHelper.js';
import { moveHelper } from './helpers/moveHelper.js';
import { renderDurationLines } from './helpers/durationLineHelper.js';
// Dynamic grid expansion disabled; helper removed

/**
 * @class ObjectManager
 * @description
 * 그리드와 재생 관리자를 연계하여 객체의 배치, 이동, 삭제 상태를 관리합니다.
 * 각 셀을 키로 하여 현재 배치된 객체를 Map으로 저장하며,
 * 재생 루프가 매 틱 전체 객체를 훑지 않도록 컬럼별 인덱스도 함께 유지합니다.
 */
export class ObjectManager {
  constructor(gridManager, playbackManager) {
    this.grid     = gridManager;
    this.playback = playbackManager;
    this.objects  = new Map();
    this.objectsByCol = new Map(); // col(number) → Map<cellKey, obj>
  }

  init(){
    initHelper(this);
  }

  setObject(cellKey, obj) {
    const [col, row] = cellKey.split('-').map(Number);
    obj.col  = col;
    obj.note = KEYS[row]?.note ?? null;

    this.objects.set(cellKey, obj);
    let bucket = this.objectsByCol.get(col);
    if (!bucket) {
      bucket = new Map();
      this.objectsByCol.set(col, bucket);
    }
    bucket.set(cellKey, obj);
  }

  deleteObject(cellKey) {
    const obj = this.objects.get(cellKey);
    if (!obj) return;
    this.objects.delete(cellKey);
    const bucket = this.objectsByCol.get(obj.col);
    if (bucket) {
      bucket.delete(cellKey);
      if (bucket.size === 0) this.objectsByCol.delete(obj.col);
    }
  }

  getByCol(col) {
    return this.objectsByCol.get(col);
  }

  async place(id, cellKey) {
    const result = await placeHelper(this, id, cellKey);
    return result;
  }

  remove(cellKey) {
    removeHelper(this, cellKey);
  }

  reset() {
    this.objects.forEach((obj, key) => {
      obj.img.remove();
      this.grid.setOccupied(key, false);
    });
    this.objects.clear();
    this.objectsByCol.clear();
    renderDurationLines(this.grid, this.objects, this.playback.bpm);
    this.playback.updateRange(this);
  }

  move(fromKey, toKey) {
    moveHelper(this, fromKey, toKey);
  }

  refreshDurationLines() {
    renderDurationLines(this.grid, this.objects, this.playback.bpm);
  }

  getAll() {
    return [...this.objects.entries()];
  }
}
