const SUBDIVISION_INTERVALS = {
  '4n': 4,
  '8n': 8,
  '16n': 16,
};

export function getMeasureInterval(subdivision) {
  return SUBDIVISION_INTERVALS[subdivision] ?? SUBDIVISION_INTERVALS['16n'];
}

export function isMeasureBoundary(col, interval) {
  return (col + 1) % interval === 0;
}

export function applySubdivisionMarkers(manager, subdivision) {
  const interval = getMeasureInterval(subdivision);
  manager.subdivision = subdivision;
  manager.cells.forEach((cell, key) => {
    const col = parseInt(key.split('-')[0], 10);
    cell.el.classList.toggle('bar-line', isMeasureBoundary(col, interval));
  });
}
