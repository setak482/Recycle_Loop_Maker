import { getMeasureInterval } from '../../grid/helpers/subdivisionHelper.js';

function alignEndToMeasureBoundary(col, interval) {
  const remainder = (col + 1) % interval;
  return remainder === 0 ? col : col + (interval - remainder);
}

/**
 * 배치 상태에서 재생 범위를 계산합니다.
 *
 * - 일반 악기: 최소~최대 열이 기본 루프 구간 (끝은 마디 경계로 정렬)
 * - 도돌이표 시작/끝 마커: 루프 구간을 명시적으로 지정 (둘이 뒤집혀 있으면 교환)
 * - 중단점 마커: 재생을 처음 시작할 열 (없으면 루프 시작 열)
 *
 * @returns {{ loopStart: number, loopEnd: number, initial: number } | null}
 */
export function computeRange(playbackManager, objectManager) {
  const instrumentCols = [];
  let startMarker = null;
  let repeatStart = null;
  let repeatEnd = null;

  objectManager.objects.forEach((obj, cellKey) => {
    const col = parseInt(cellKey.split('-')[0], 10);
    const marker = obj.detail?.marker;
    if (marker === 'start') startMarker = col;
    else if (marker === 'repeat_start') repeatStart = col;
    else if (marker === 'repeat_end') repeatEnd = col;
    else instrumentCols.push(col);
  });

  if (repeatStart !== null && repeatEnd !== null && repeatEnd < repeatStart) {
    [repeatStart, repeatEnd] = [repeatEnd, repeatStart];
  }

  const interval = getMeasureInterval(playbackManager.subdivision);
  let loopStart = repeatStart
    ?? (instrumentCols.length ? Math.min(...instrumentCols) : null);
  let loopEnd = repeatEnd
    ?? (instrumentCols.length
      ? alignEndToMeasureBoundary(Math.max(...instrumentCols), interval)
      : null);

  if (loopStart === null && loopEnd === null) return null;
  loopStart = loopStart ?? 0;
  loopEnd = loopEnd ?? alignEndToMeasureBoundary(loopStart, interval);
  if (loopEnd < loopStart) loopEnd = loopStart;

  return { loopStart, loopEnd, initial: startMarker ?? loopStart };
}

/**
 * @param {PlaybackManager} playbackManager
 * @param {Object} objectManager
 * @returns {boolean}
 */
export function calcRangeHelper(playbackManager, objectManager) {
  const range = computeRange(playbackManager, objectManager);
  if (!range) return false;

  playbackManager._startCol = range.initial;
  playbackManager._loopStartCol = range.loopStart;
  playbackManager._endCol = range.loopEnd;
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

  const range = computeRange(playbackManager, objectManager);
  if (!range) {
    // 악기·도돌이표 없이 중단점만 남은 경우 등 재생할 범위가 없음
    playbackManager.stop();
    return;
  }

  playbackManager._startCol = range.initial;
  playbackManager._loopStartCol = range.loopStart;
  playbackManager._endCol = range.loopEnd;

  const minCol = Math.min(range.loopStart, range.initial);
  if (playbackManager._currentCol < minCol) {
    playbackManager._currentCol = minCol;
  }
  if (playbackManager._currentCol > range.loopEnd) {
    playbackManager._currentCol = range.loopStart;
  }
}
