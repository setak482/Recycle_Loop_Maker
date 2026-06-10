import { getMeasureInterval } from '../../grid/helpers/subdivisionHelper.js';

function alignEndToMeasureBoundary(col, interval) {
  const remainder = (col + 1) % interval;
  return remainder === 0 ? col : col + (interval - remainder);
}

/**
 * @param {PlaybackManager} playbackManager
 * @param {Object} objectManager
 * @returns {boolean}
 */
export function calcRangeHelper(playbackManager, objectManager) {
  if (objectManager.objects.size === 0) return false;

  const cols = [...objectManager.objects.keys()]
    .map(key => parseInt(key.split('-')[0], 10));

  playbackManager._startCol = Math.min(...cols);
  playbackManager._endCol = alignEndToMeasureBoundary(
    Math.max(...cols),
    getMeasureInterval(playbackManager.subdivision)
  );
  return true;
}

/**
 * @param {PlaybackManager} playbackManager
 * @param {Object} objectManager
 * @returns {void}
 */
export function updateRangeHelper(playbackManager, objectManager) {
  if (objectManager.objects.size === 0) {
    playbackManager.stop();
    return;
  }

  const cols = [...objectManager.objects.keys()]
    .map(key => parseInt(key.split('-')[0], 10));

  playbackManager._startCol = Math.min(...cols);
  playbackManager._endCol = alignEndToMeasureBoundary(
    Math.max(...cols),
    getMeasureInterval(playbackManager.subdivision)
  );

  if (playbackManager._currentCol < playbackManager._startCol) {
    playbackManager._currentCol = playbackManager._startCol;
  }

  if (playbackManager._currentCol > playbackManager._endCol) {
    playbackManager._currentCol = playbackManager._startCol;
  }
}
