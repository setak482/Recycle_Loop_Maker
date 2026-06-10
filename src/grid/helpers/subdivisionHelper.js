const SUBDIVISION_INTERVALS = {
  '4n': 4,
  '8n': 8,
  '16n': 16,
  '32n': 32,
};

export function getMeasureInterval(subdivision) {
  return SUBDIVISION_INTERVALS[subdivision] ?? SUBDIVISION_INTERVALS['16n'];
}

export function isMeasureBoundary(col, interval) {
  return (col + 1) % interval === 0;
}

export function applySubdivisionMarkers(manager, subdivision) {
  const interval = getMeasureInterval(subdivision);
  const prevInterval = manager._markerInterval ?? null;
  manager.subdivision = subdivision;
  if (prevInterval === interval) return;
  manager._markerInterval = interval;

  const setColumn = (col, on) => {
    for (let row = 0; row < manager.rows; row++) {
      manager.cells.get(`${col}-${row}`)?.el.classList.toggle('bar-line', on);
    }
  };

  // 마디선은 컬럼 단위로만 달라지므로 전체 셀을 순회하지 않고
  // 이전 간격에서 빠지는 컬럼과 새 간격의 컬럼만 갱신합니다.
  if (prevInterval !== null) {
    for (let col = prevInterval - 1; col < manager.cols; col += prevInterval) {
      if (!isMeasureBoundary(col, interval)) setColumn(col, false);
    }
  }
  for (let col = interval - 1; col < manager.cols; col += interval) {
    setColumn(col, true);
  }
}
