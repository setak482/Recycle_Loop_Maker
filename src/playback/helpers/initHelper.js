import { CELL_W } from '../../constants/config.js';

/**
 * @param {PlaybackManager} playbackManager
 * @param {Object} gridManager
 */
export function initHelper(playbackManager, gridManager) {
  playbackManager._world = gridManager.world;
  playbackManager._initPlayhead();
}

/**
 * @param {PlaybackManager} playbackManager
 */
export function initPlayheadHelper(playbackManager) {
  const playhead = document.createElement('div');
  playhead.id = 'playhead';
  playbackManager._world.appendChild(playhead);
  playbackManager._playhead = playhead;
}

/**
 * @param {PlaybackManager} playbackManager
 * @param {number} col
 */
export function movePlayheadHelper(playbackManager, col) {
  if (!playbackManager._playhead) return;
  // Tone.Draw가 이미 rAF 타이밍에 호출하므로 추가 rAF 없이 바로 씁니다.
  // translate3d로 GPU 합성을 유도합니다.
  playbackManager._playhead.style.transform = `translate3d(${col * CELL_W}px, 0, 0)`;
}
