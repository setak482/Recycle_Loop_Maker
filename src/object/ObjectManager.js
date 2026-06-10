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
 * 각 셀을 키로 하여 현재 배치된 객체를 Map으로 저장합니다.
 */
export class ObjectManager {
  constructor(gridManager, playbackManager) {
    this.grid     = gridManager;
    this.playback = playbackManager;
    this.objects  = new Map();
    this.history  = null;
  }

  init(){
    initHelper(this);
  }

  setHistory(history) {
    this.history = history;
  }

  async place(id, cellKey, options = {}) {
    const result = await placeHelper(this, id, cellKey, options);
    this.history?.commit();
    return result;
  }

  remove(cellKey) {
    removeHelper(this, cellKey);
    this.history?.commit();
  }

  reset() {
    const keys = [...this.objects.keys()];
    keys.forEach(key => {
      const obj = this.objects.get(key);
      if (!obj) return;
      obj.img.remove();
      this.grid.setOccupied(key, false);
      this.playback.unregister(key);
      this.objects.delete(key);
    });
    renderDurationLines(this.grid, this.objects, this.playback.bpm);
    this.playback.updateRange(this);
    this.history?.commit();
  }

  move(fromKey, toKey, options = {}) {
    moveHelper(this, fromKey, toKey, options);
    this.history?.commit();
  }

  refreshDurationLines() {
    renderDurationLines(this.grid, this.objects, this.playback.bpm);
  }

  getAll() {
    return [...this.objects.entries()];
  }
}
